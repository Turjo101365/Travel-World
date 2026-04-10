import React, { useEffect, useState } from 'react';
import ApiClient from '../api';
import '../css/admin-dashboard.css';

type AdminTab = 'users' | 'requests' | 'payments';

interface AdminUserRecord {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  created_at: string;
  is_super_admin?: boolean;
}

interface AdminBookingRecord {
  id: number;
  transaction_id: string;
  status: string;
  days: number;
  start_date?: string | null;
  end_date?: string | null;
  amount: number | string;
  currency: string;
  user?: {
    name: string;
    email: string;
    phone?: string | null;
  };
  guide?: {
    name: string;
    location?: string;
  };
  destination?: {
    title?: string;
    location_label?: string;
    country?: string;
    city?: string;
  };
}

interface AdminPaymentRecord {
  id: number;
  transaction_id: string;
  amount: number | string;
  currency: string;
  status: string;
  paid_at: string;
  card_brand?: string | null;
  card_last_four: string;
  user?: {
    name: string;
    email: string;
  };
  guide?: {
    name: string;
    location?: string;
  };
}

const AdminDashboard: React.FC = () => {
  const user = ApiClient.getUser();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRecord[]>([]);
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');

      try {
        const api = new ApiClient();
        const [usersResponse, bookingsResponse, paymentsResponse] = await Promise.all([
          api.getAdminUsers(),
          api.getAdminBookings(),
          api.getAdminPayments(),
        ]);

        if (
          usersResponse?.status !== 'success' ||
          bookingsResponse?.status !== 'success' ||
          paymentsResponse?.status !== 'success'
        ) {
          setError('Failed to load the super admin dashboard.');
          return;
        }

        setUsers((usersResponse.data || []).filter((record: AdminUserRecord) => !record.is_super_admin));
        setBookings(bookingsResponse.data || []);
        setPayments(paymentsResponse.data || []);
      } catch (fetchError) {
        console.error('Failed to load admin dashboard:', fetchError);
        setError('Failed to load the super admin dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) {
      return 'N/A';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatMoney = (amount: number | string, currency = 'USD') => {
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
      return `${currency} ${numericAmount.toFixed(2)}`;
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="admin-brand-badge">TW</span>
            <div>
              <h1>Super Admin</h1>
              <p>Travel World control center</p>
            </div>
          </div>

          <div className="admin-user-chip">
            <span>Signed in as</span>
            <strong>{user?.name || 'Super Admin'}</strong>
            <small>{user?.email || 'admin@travelworld.com'}</small>
          </div>

          <nav className="admin-nav">
            <button
              type="button"
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              type="button"
              className={activeTab === 'requests' ? 'active' : ''}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
            <button
              type="button"
              className={activeTab === 'payments' ? 'active' : ''}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-hero">
            <div>
              <p className="admin-eyebrow">Secure Dashboard</p>
              <h2>System overview for Travel World</h2>
              <p>
                Review registered users, confirmed guide hire requests, and payment activity from a
                single protected admin panel.
              </p>
              <div className="admin-owner-card">
                <span>Admin Profile</span>
                <strong>{user?.name || 'Travel World Super Admin'}</strong>
                <p>{user?.email || 'admin@travelworld.com'}</p>
              </div>
            </div>

            <div className="admin-stats">
              <div className="admin-stat-card">
                <span>Total Users</span>
                <strong>{users.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Hire Requests</span>
                <strong>{bookings.length}</strong>
              </div>
              <div className="admin-stat-card">
                <span>Payments</span>
                <strong>{payments.length}</strong>
              </div>
            </div>
          </div>

          {loading ? <div className="admin-state-card">Loading super admin dashboard...</div> : null}
          {!loading && error ? <div className="admin-state-card error">{error}</div> : null}

          {!loading && !error && activeTab === 'users' ? (
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h3>Registered Users</h3>
                <p>All user accounts currently available in the system.</p>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((record) => (
                      <tr key={record.id}>
                        <td>
                          {record.name}
                          {record.is_super_admin ? <span className="admin-pill">Super Admin</span> : null}
                        </td>
                        <td>{record.email}</td>
                        <td>{record.phone || 'N/A'}</td>
                        <td>{record.address || 'N/A'}</td>
                        <td>{formatDate(record.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {!loading && !error && activeTab === 'requests' ? (
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h3>Guide Hire Requests</h3>
                <p>Confirmed request records generated from completed guide payments.</p>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Traveler</th>
                      <th>Guide</th>
                      <th>Destination</th>
                      <th>Dates</th>
                      <th>Days</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <strong>{record.user?.name || 'N/A'}</strong>
                          <span>{record.user?.email || 'N/A'}</span>
                        </td>
                        <td>
                          <strong>{record.guide?.name || 'N/A'}</strong>
                          <span>{record.guide?.location || 'N/A'}</span>
                        </td>
                        <td>
                          {record.destination?.title ||
                            record.destination?.location_label ||
                            [
                              record.destination?.city,
                              record.destination?.country,
                            ]
                              .filter(Boolean)
                              .join(', ') ||
                            'N/A'}
                        </td>
                        <td>
                          <strong>{formatDate(record.start_date)}</strong>
                          <span>to {formatDate(record.end_date)}</span>
                        </td>
                        <td>{record.days}</td>
                        <td>
                          <span className="admin-status">{record.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {!loading && !error && activeTab === 'payments' ? (
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h3>Payment Transactions</h3>
                <p>All recorded guide-hire payments completed in the platform.</p>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>User</th>
                      <th>Guide</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Paid Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <strong>{record.transaction_id}</strong>
                          <span className="admin-status">{record.status}</span>
                        </td>
                        <td>
                          <strong>{record.user?.name || 'N/A'}</strong>
                          <span>{record.user?.email || 'N/A'}</span>
                        </td>
                        <td>
                          <strong>{record.guide?.name || 'N/A'}</strong>
                          <span>{record.guide?.location || 'N/A'}</span>
                        </td>
                        <td>{formatMoney(record.amount, record.currency)}</td>
                        <td>
                          {(record.card_brand || 'Card')} ending in {record.card_last_four}
                        </td>
                        <td>{formatDate(record.paid_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
