import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

interface RetriableRequestConfig extends AxiosRequestConfig {
  __triedBaseUrls?: string[];
}

export type UserRole = 'admin' | 'customer' | string;

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string | null;
  address?: string | null;
  profile_photo_url?: string | null;
}

export interface DashboardStats {
  totalUsers: number;
  totalPackages: number;
  pendingBookings: number;
  totalRevenue: number;
}

export interface TourPackageRecord {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  location: string;
  max_participants: number;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface BookingRecord {
  id: number;
  user_id: number;
  tour_package_id: number;
  booking_date: string;
  participants: number;
  total_price: number;
  status: BookingStatus;
  payment_status?: string;
  created_at?: string;
  updated_at?: string;
  user?: AuthUser | null;
  tour_package?: TourPackageRecord | null;
}

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOptionalString = (value: unknown): string | null => {
  return typeof value === 'string' ? value : null;
};

const toStringValue = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

class ApiClient {
  private client: AxiosInstance;
  private static tokenKey = 'jwt_token';
  private static userKey = 'user_data';
  private configuredBaseUrl: string;
  private static localFallbackBaseUrls = [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
  ];
  private baseUrlCandidates: string[];

  private static normalizeUserRecord(user: unknown): AuthUser | null {
    if (!user || typeof user !== 'object') {
      return null;
    }

    const record = user as Record<string, unknown>;

    return {
      id: toNumber(record.id),
      name: toStringValue(record.name),
      email: toStringValue(record.email),
      role: typeof record.role === 'string' ? record.role : undefined,
      phone: toOptionalString(record.phone),
      address: toOptionalString(record.address),
      profile_photo_url: toOptionalString(record.profile_photo_url),
    };
  }

  private normalizePackageRecord(pkg: unknown): TourPackageRecord | null {
    if (!pkg || typeof pkg !== 'object') {
      return null;
    }

    const record = pkg as Record<string, unknown>;

    return {
      id: toNumber(record.id),
      title: toStringValue(record.title),
      description: toStringValue(record.description),
      price: toNumber(record.price),
      duration: toNumber(record.duration),
      location: toStringValue(record.location),
      max_participants: toNumber(record.max_participants),
      image_url: toOptionalString(record.image_url),
      created_at: toOptionalString(record.created_at) || undefined,
      updated_at: toOptionalString(record.updated_at) || undefined,
    };
  }

  private normalizePackageList(data: unknown): TourPackageRecord[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => this.normalizePackageRecord(item))
      .filter((item): item is TourPackageRecord => item !== null);
  }

  private normalizeBookingRecord(booking: unknown): BookingRecord | null {
    if (!booking || typeof booking !== 'object') {
      return null;
    }

    const record = booking as Record<string, unknown>;
    const relationPackage = record.tour_package ?? record.tourPackage;
    const normalizedPackage = this.normalizePackageRecord(relationPackage);
    const status = toStringValue(record.status, 'pending');
    const normalizedStatus: BookingStatus =
      status === 'approved' || status === 'rejected' ? status : 'pending';

    return {
      id: toNumber(record.id),
      user_id: toNumber(record.user_id),
      tour_package_id: toNumber(record.tour_package_id),
      booking_date: toStringValue(record.booking_date),
      participants: toNumber(record.participants),
      total_price: toNumber(record.total_price),
      status: normalizedStatus,
      payment_status: toOptionalString(record.payment_status) || undefined,
      created_at: toOptionalString(record.created_at) || undefined,
      updated_at: toOptionalString(record.updated_at) || undefined,
      user: ApiClient.normalizeUserRecord(record.user),
      tour_package: normalizedPackage,
    };
  }

  private normalizeBookingList(data: unknown): BookingRecord[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((item) => this.normalizeBookingRecord(item))
      .filter((item): item is BookingRecord => item !== null);
  }

  constructor() {
    this.configuredBaseUrl = this.normalizeBaseUrl(secrets.backendEndpoint);
    this.baseUrlCandidates = this.buildBaseUrlCandidates(this.configuredBaseUrl);

    this.client = axios.create({
      baseURL: this.configuredBaseUrl || undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = ApiClient.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors (token expired)
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const requestConfig = (error.config || {}) as RetriableRequestConfig;

        // Auto-retry with common local backend URLs to reduce dev-time "Network Error".
        if (!error.response && requestConfig?.url) {
          const nextBaseUrl = this.getNextBaseUrl(requestConfig);
          if (nextBaseUrl) {
            requestConfig.baseURL = nextBaseUrl;
            return this.client.request(requestConfig);
          }
        }

        if (error.response?.status === 401) {
          ApiClient.logout();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private normalizeBaseUrl(url?: string): string {
    return (url || '').trim().replace(/\/+$/, '');
  }

  private buildBaseUrlCandidates(configuredBaseUrl: string): string[] {
    const candidates = [configuredBaseUrl, ...ApiClient.localFallbackBaseUrls]
      .map((url) => this.normalizeBaseUrl(url))
      .filter((url) => url.length > 0);

    return Array.from(new Set(candidates));
  }

  private getNextBaseUrl(config: RetriableRequestConfig): string | null {
    const tried = new Set(config.__triedBaseUrls || []);
    const currentBaseUrl = this.normalizeBaseUrl(
      (config.baseURL as string) || this.configuredBaseUrl || ''
    );

    if (currentBaseUrl) {
      tried.add(currentBaseUrl);
    }

    const nextBaseUrl = this.baseUrlCandidates.find((url) => !tried.has(url));
    if (!nextBaseUrl) {
      return null;
    }

    config.__triedBaseUrls = [...Array.from(tried), nextBaseUrl];
    return nextBaseUrl;
  }

  // Store token
  static setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token
  static getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove token
  static removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Store user data
  static setUser(user: unknown): void {
    const normalizedUser = this.normalizeUserRecord(user);

    if (!normalizedUser) {
      this.removeUser();
      return;
    }

    localStorage.setItem(this.userKey, JSON.stringify(normalizedUser));
  }

  // Get user data
  static getUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem(this.userKey);
      if (!userStr) {
        return null;
      }

      const normalizedUser = this.normalizeUserRecord(JSON.parse(userStr));
      if (!normalizedUser) {
        this.removeUser();
      }

      return normalizedUser;
    } catch {
      this.removeUser();
      return null;
    }
  }

  // Remove user data
  static removeUser(): void {
    localStorage.removeItem(this.userKey);
  }

  // Logout - clear all auth data
  static logout(): void {
    this.removeToken();
    this.removeUser();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Check if current user is an admin
  static isAdmin(): boolean {
    return this.getUser()?.role === 'admin';
  }

  // Auth methods
  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/api/login', { email, password });
      if (response.data.status === 'success') {
        ApiClient.setToken(response.data.authorisation.token);
        ApiClient.setUser(response.data.user);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 401 && error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async register(name: string, email: string, password: string, password_confirmation: string) {
    try {
      const response = await this.client.post('/api/register', {
        name,
        email,
        password,
        password_confirmation,
      });
      if (response.data.status === 'success') {
        ApiClient.setToken(response.data.authorisation.token);
        ApiClient.setUser(response.data.user);
      }
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.client.post('/api/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      ApiClient.logout();
    }
  }

  async changePassword(
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) {
    try {
      const response = await this.client.post('/api/change-password', {
        current_password,
        new_password,
        new_password_confirmation,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await this.client.get('/api/me');
      if (response.data?.status === 'success' && response.data?.user) {
        ApiClient.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProfile(name: string, email: string, phone?: string, address?: string) {
    try {
      const response = await this.client.put('/api/profile', {
        name,
        email,
        phone: phone || null,
        address: address || null,
      });

      if (response.data?.status === 'success' && response.data?.user) {
        ApiClient.setUser(response.data.user);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async uploadProfilePhoto(photo: File) {
    try {
      const formData = new FormData();
      formData.append('photo', photo);

      const response = await this.client.post('/api/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.status === 'success' && response.data?.user) {
        ApiClient.setUser(response.data.user);
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  // Tour Guide methods
  async getTourGuides() {
    try {
      const response = await this.client.get('/api/tour-guides');
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { status: 'error', data: [] };
    }
  }

  async getTourGuide(id: number | string) {
    try {
      const response = await this.client.get(`/api/tour-guides/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { status: 'error', data: null };
    }
  }

  async submitContactMessage(name: string, email: string, message: string) {
    try {
      const response = await this.client.post('/api/contact-messages', { name, email, message });
      return response.data;
    } catch (error: any) {
      // Keep validation messages available for caller while still handling other errors centrally.
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async requestPasswordResetCode(email: string) {
    try {
      const response = await this.client.post('/api/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async resetPassword(email: string, code: string, password: string, password_confirmation: string) {
    try {
      const response = await this.client.post('/api/reset-password', {
        email,
        code,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async createPayment(payload: {
    guide_id: number;
    days: number;
    name_on_card: string;
    card_number: string;
    expiry: string;
    cvv: string;
  }) {
    try {
      const response = await this.client.post('/api/payments', payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async getPayments() {
    try {
      const response = await this.client.get('/api/payments');
      return response.data;
    } catch (error) {
      this.handleError(error);
      return { status: 'error', data: [] };
    }
  }

  // currently, only fetches 1 session greater than current time
  async getSession() {
    try {
      const response = await this.client.get('/api/session');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createSession(name: string, duration: number, username: string, password: string) {
    try {
      if (!username || !password) {
        toast.error('Credentials are required');
        return;
      }
      const response = await this.client.post('/api/session', { name, duration, username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateSession(session_id: number, active: boolean, username: string, password: string) {
    try {
      if (!username || !password) {
        toast.error('Credentials are required');
        return;
      }

      const response = await this.client.put('/api/session', { session_id, active, username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async submitAttendance(roll: number) {
    try {
      const response = await this.client.post('/api/attendance', { roll });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async viewSessions(username: string, password: string) {
    try {
      if (!username || !password) {
        toast.error('Credentials are required');
        return;
      }
      const response = await this.client.post('/api/sessions', { username, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // --- Admin Dashboard Methods ---
  async getDashboardStats() {
    try {
      const response = await this.client.get('/api/admin/dashboard-stats');
      return {
        totalUsers: toNumber(response.data?.totalUsers),
        totalPackages: toNumber(response.data?.totalPackages),
        pendingBookings: toNumber(response.data?.pendingBookings),
        totalRevenue: toNumber(response.data?.totalRevenue),
      } as DashboardStats;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // --- Admin Package Methods ---
  async getAdminPackages() {
    try {
      const response = await this.client.get('/api/tour-packages');
      return this.normalizePackageList(response.data);
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async createPackage(data: any) {
    try {
      const response = await this.client.post('/api/tour-packages', data);
      return this.normalizePackageRecord(response.data);
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async updatePackage(id: number, data: any) {
    try {
      const response = await this.client.put(`/api/tour-packages/${id}`, data);
      return this.normalizePackageRecord(response.data);
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  async deletePackage(id: number) {
    try {
      const response = await this.client.delete(`/api/tour-packages/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // --- Admin Booking Methods ---
  async getAdminBookings() {
    try {
      const response = await this.client.get('/api/admin/bookings');
      return this.normalizeBookingList(response.data);
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async updateBookingStatus(id: number, status: string) {
    try {
      const response = await this.client.put(`/api/admin/bookings/${id}/status`, { status });
      return this.normalizeBookingRecord(response.data);
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  // --- Customer/Public Package Methods ---
  async getPackages() {
    return this.getAdminPackages();
  }

  async getPackage(id: number) {
    try {
      const response = await this.client.get(`/api/tour-packages/${id}`);
      return this.normalizePackageRecord(response.data);
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  // --- Customer Booking Methods ---
  async getMyBookings() {
    try {
      const response = await this.client.get('/api/my-bookings');
      return this.normalizeBookingList(response.data);
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async createBooking(data: { tour_package_id: number; booking_date: string; participants: number }) {
    try {
      const response = await this.client.post('/api/bookings', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status !== 422) {
        this.handleError(error);
      }
      throw error;
    }
  }

  // Handle common errors
  handleError(error: any) {
    const activeBaseUrl = this.normalizeBaseUrl(
      this.configuredBaseUrl || secrets.backendEndpoint || ''
    );

    if (error.response) {
      // Server responded with a status other than 2xx
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Something went wrong';
      console.error(`API Error: ${error.response.status} - ${message}`);
      toast.error(message);
    } else if (error.request) {
      // Request was made, but no response was received
      console.error('API Error: No response received', error.request);
      const networkMessage = activeBaseUrl
        ? `Cannot connect to backend at ${activeBaseUrl}. Start backend server and try again.`
        : 'Cannot connect to backend. Start backend server and try again.';
      toast.error(networkMessage);
    } else {
      // Something went wrong while setting up the request
      console.error('API Error:', error.message);
      toast.error(error.message || 'Something went wrong');
    }
  }
}

export default ApiClient;
export { ApiClient };
