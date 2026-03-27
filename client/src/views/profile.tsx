import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import '../css/profile.css';
import ApiClient from '../api';

interface UserProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  profilePhotoUrl: string;
}

interface HiredGuideDetails {
  id: number;
  name: string;
  location: string;
  hire_cost?: number | string;
  phone?: string;
  email?: string;
  photo?: string;
}

interface HiredGuideBooking {
  id: number;
  transaction_id: string;
  amount: number | string;
  currency: string;
  days: number;
  status: string;
  paid_at: string;
  guide?: HiredGuideDetails;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState('');
  const [hiredBookings, setHiredBookings] = useState<HiredGuideBooking[]>([]);
  const [passwordError, setPasswordError] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // User data from API
  const [userData, setUserData] = useState<UserProfileData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profilePhotoUrl: ''
  });
  const [savedUserData, setSavedUserData] = useState<UserProfileData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profilePhotoUrl: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const api = new ApiClient();
        const response = await api.getMe();
        if (response && response.status === 'success' && response.user) {
          const profileData = {
            fullName: response.user.name || '',
            email: response.user.email || '',
            phone: response.user.phone || '',
            address: response.user.address || '',
            profilePhotoUrl: response.user.profile_photo_url || ''
          };
          setUserData(profileData);
          setSavedUserData(profileData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Use stored user data as fallback
        const storedUser = ApiClient.getUser();
        if (storedUser) {
          const profileData = {
            fullName: storedUser.name || '',
            email: storedUser.email || '',
            phone: storedUser.phone || '',
            address: storedUser.address || '',
            profilePhotoUrl: storedUser.profile_photo_url || ''
          };
          setUserData(profileData);
          setSavedUserData(profileData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchHiredGuides = useCallback(async () => {
    setLoadingBookings(true);
    setBookingsError('');

    try {
      const api = new ApiClient();
      const response = await api.getPayments();

      if (response?.status === 'success' && Array.isArray(response.data)) {
        setHiredBookings(response.data as HiredGuideBooking[]);
        return;
      }

      setHiredBookings([]);
      setBookingsError(response?.message || 'Failed to load hired tour guides.');
    } catch (error) {
      console.error('Failed to fetch hired guides:', error);
      setHiredBookings([]);
      setBookingsError('Failed to load hired tour guides.');
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchHiredGuides();
  }, [fetchHiredGuides]);

  const formatBookedDate = (dateValue: string) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number | string, currency = 'USD') => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) {
      return `${currency} 0.00`;
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(numericAmount);
    } catch {
      return `$${numericAmount.toFixed(2)}`;
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Revert unsaved edits if user cancels editing.
      setUserData(savedUserData);
      setIsEditing(false);
      return;
    }

    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (savingProfile) return;

    setSavingProfile(true);
    try {
      const api = new ApiClient();
      const response = await api.updateProfile(
        userData.fullName.trim(),
        userData.email.trim(),
        userData.phone.trim(),
        userData.address.trim()
      );

      if (response?.status === 'success' && response?.user) {
        const updatedProfile = {
          fullName: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          address: response.user.address || '',
          profilePhotoUrl: response.user.profile_photo_url || '',
        };
        setUserData(updatedProfile);
        setSavedUserData(updatedProfile);
        setIsEditing(false);
        toast.success(response?.message || 'Profile updated successfully.');
        return;
      }

      toast.error(response?.message || 'Failed to update profile.');
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined;
      const firstValidationError = validationErrors ? Object.values(validationErrors)[0]?.[0] : null;
      toast.error(
        firstValidationError ||
        error?.response?.data?.message ||
        'Failed to update profile. Please try again.'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo size must be within 2MB.');
      e.target.value = '';
      return;
    }

    setUploadingPhoto(true);
    try {
      const api = new ApiClient();
      const response = await api.uploadProfilePhoto(file);

      if (response?.status === 'success' && response?.user) {
        const updatedProfile = {
          fullName: response.user.name || userData.fullName,
          email: response.user.email || userData.email,
          phone: response.user.phone || '',
          address: response.user.address || '',
          profilePhotoUrl: response.user.profile_photo_url || '',
        };

        setUserData(updatedProfile);
        setSavedUserData(updatedProfile);
        toast.success(response?.message || 'Profile photo uploaded successfully.');
        e.target.value = '';
        return;
      }

      toast.error(response?.message || 'Failed to upload profile photo.');
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined;
      const firstValidationError = validationErrors ? Object.values(validationErrors)[0]?.[0] : null;
      toast.error(
        firstValidationError ||
        error?.response?.data?.message ||
        'Failed to upload profile photo. Please try again.'
      );
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const openPasswordModal = () => {
    setPasswordError('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const closePasswordModal = (force = false) => {
    if (updatingPassword && !force) return;
    setShowPasswordModal(false);
    setPasswordError('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
    setPasswordError('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatingPassword) return;

    const currentPassword = passwordData.currentPassword.trim();
    const newPassword = passwordData.newPassword.trim();
    const confirmPassword = passwordData.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setUpdatingPassword(true);
    setPasswordError('');

    try {
      const api = new ApiClient();
      const response = await api.changePassword(currentPassword, newPassword, confirmPassword);

      if (response?.status === 'success') {
        toast.success(response?.message || 'Password changed successfully.');
        closePasswordModal(true);
        return;
      }

      setPasswordError(response?.message || 'Failed to change password.');
    } catch (error: any) {
      const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined;
      const firstValidationError = validationErrors ? Object.values(validationErrors)[0]?.[0] : null;
      setPasswordError(
        firstValidationError ||
        error?.response?.data?.message ||
        'Failed to change password. Please try again.'
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    try {
      const api = new ApiClient();
      await api.logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      ApiClient.logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Background */}
      <div className="profile-bg"></div>
      <div className="profile-overlay"></div>
      
      {/* Floating travel elements */}
      <div className="travel-elements">
        <span>✈️</span>
        <span>🌍</span>
        <span>🏝️</span>
        <span>🗺️</span>
        <span>🌄</span>
        <span>🏔️</span>
      </div>

      <div className="profile-content">
        {/* Header Card */}
        <motion.div 
          className="profile-header-card"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-header-bg"></div>
          <div className="profile-header-content">
            <div className="profile-avatar">
              {userData.profilePhotoUrl ? (
                <img
                  src={userData.profilePhotoUrl}
                  alt={`${userData.fullName || 'User'} profile`}
                  onError={(event) => {
                    (event.target as HTMLImageElement).src = '/images/img.jpg';
                  }}
                />
              ) : (
                <div className="profile-avatar-placeholder">👤</div>
              )}

              <label className={`avatar-edit ${uploadingPhoto ? 'disabled' : ''}`} title="Upload profile photo">
                <span>{uploadingPhoto ? '⏳' : '📷'}</span>
                <input
                  className="avatar-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
            <p className="profile-photo-note">
              {uploadingPhoto ? 'Uploading photo...' : 'Upload photo (JPG, PNG, WEBP, max 2MB)'}
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {userData.fullName}
            </motion.h1>
            <motion.div 
              className="profile-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button className="btn-change-password" onClick={openPasswordModal}>
                🔐 Change Password
              </button>
              <button className="btn-logout-profile" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? '⏳ Logging out...' : '🚪 Logout'}
              </button>
            </motion.div>
          </div>
        </motion.div>

        <div className="profile-grid">
          {/* Personal Info Card */}
          <motion.div 
            className="profile-card personal-info-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="card-header">
              <h2>👤 Personal Information</h2>
              <div className="card-header-actions">
                {isEditing && <span className="editing-badge">Editing</span>}
                <button
                  type="button"
                  className="btn-edit-inline"
                  onClick={handleEdit}
                  disabled={savingProfile}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="info-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{userData.fullName}</p>
                )}
              </div>
              <div className="info-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="edit-input"
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>
              <div className="info-group">
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="edit-input"
                    placeholder="Add phone number"
                  />
                ) : (
                  <p>{userData.phone || 'Not set'}</p>
                )}
              </div>
              <div className="info-group">
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className="edit-input"
                    placeholder="Add address"
                  />
                ) : (
                  <p>{userData.address || 'Not set'}</p>
                )}
              </div>
              {isEditing && (
                <motion.button 
                  className="btn-save"
                  onClick={handleSave}
                  disabled={savingProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {savingProfile ? 'Saving...' : '💾 Save Changes'}
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Hired Tour Guides Card */}
          <motion.div 
            className="profile-card history-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="card-header">
              <h2>🧳 Hired Tour Guides</h2>
              <span className="view-all">{hiredBookings.length} Booking{hiredBookings.length === 1 ? '' : 's'}</span>
            </div>
            <div className="card-body">
              {loadingBookings ? (
                <div className="bookings-empty-state">Loading hired guides...</div>
              ) : bookingsError ? (
                <div className="bookings-empty-state">
                  <p>{bookingsError}</p>
                  <button type="button" className="btn-bookings-retry" onClick={fetchHiredGuides}>
                    Retry
                  </button>
                </div>
              ) : hiredBookings.length === 0 ? (
                <div className="bookings-empty-state">
                  <p>You haven’t hired any guide yet.</p>
                  <Link to="/tourguide" className="btn-bookings-retry">
                    Hire a Guide
                  </Link>
                </div>
              ) : (
                <div className="booking-list">
                  {hiredBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      className="booking-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.08 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="booking-top-row">
                        <div className="travel-icon">🛫</div>
                        <div className="travel-details">
                          <h4>{booking.guide?.name || 'Tour Guide'}</h4>
                          <p>{booking.guide?.location || 'Location not available'}</p>
                        </div>
                        <span className="travel-status completed">{booking.status || 'completed'}</span>
                      </div>

                      <div className="booking-meta-grid">
                        <div>
                          <span className="booking-label">Booked On</span>
                          <p>{formatBookedDate(booking.paid_at)}</p>
                        </div>
                        <div>
                          <span className="booking-label">Days</span>
                          <p>{booking.days} day{booking.days > 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <span className="booking-label">Total Cost</span>
                          <p>{formatAmount(booking.amount, booking.currency || 'USD')}</p>
                        </div>
                        <div>
                          <span className="booking-label">Per Day</span>
                          <p>{formatAmount(booking.guide?.hire_cost || 0, booking.currency || 'USD')}</p>
                        </div>
                        <div>
                          <span className="booking-label">Guide Email</span>
                          <p>{booking.guide?.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <span className="booking-label">Guide Phone</span>
                          <p>{booking.guide?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Back to Home */}
        <motion.div 
          className="back-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to="/" className="back-home-btn">
            ← Back to Homepage
          </Link>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => closePasswordModal()}
        >
          <motion.div 
            className="password-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h3>🔐 Change Password</h3>
            <form className="modal-body" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </div>
              {passwordError ? <p className="password-error-text">{passwordError}</p> : null}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => closePasswordModal()} disabled={updatingPassword}>
                  Cancel
                </button>
                <button type="submit" className="btn-confirm" disabled={updatingPassword}>
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
