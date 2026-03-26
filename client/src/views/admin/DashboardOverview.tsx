import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import ApiClient, { BookingRecord, DashboardStats } from '../../api';

const emptyStats: DashboardStats = {
  totalUsers: 0,
  totalPackages: 0,
  pendingBookings: 0,
  totalRevenue: 0,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value?: string) => {
  if (!value) {
    return 'Not scheduled';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const fetchDashboardSnapshot = async () => {
  const api = new ApiClient();
  const [stats, bookings] = await Promise.all([
    api.getDashboardStats(),
    api.getAdminBookings(),
  ]);

  return {
    stats: stats ?? emptyStats,
    bookings,
  };
};

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      const snapshot = await fetchDashboardSnapshot();

      if (!isMounted) {
        return;
      }

      setStats(snapshot.stats);
      setBookings(snapshot.bookings);
      setLoading(false);
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    const snapshot = await fetchDashboardSnapshot();
    setStats(snapshot.stats);
    setBookings(snapshot.bookings);
    setRefreshing(false);
  };

  const approvedBookings = bookings.filter((booking) => booking.status === 'approved');
  const rejectedBookings = bookings.filter((booking) => booking.status === 'rejected');
  const pendingBookings = stats.pendingBookings || bookings.filter((booking) => booking.status === 'pending').length;
  const totalBookings = bookings.length;
  const approvedRevenue = approvedBookings.reduce(
    (sum, booking) => sum + Number(booking.total_price || 0),
    0
  );
  const approvalRate = totalBookings > 0 ? Math.round((approvedBookings.length / totalBookings) * 100) : 0;
  const uniqueTravelers = new Set(bookings.map((booking) => booking.user_id)).size;
  const packageDemand = bookings.reduce<Record<string, number>>((counts, booking) => {
    const packageName = booking.tour_package?.title || `Package #${booking.tour_package_id}`;
    counts[packageName] = (counts[packageName] || 0) + 1;
    return counts;
  }, {});
  const topPackageEntry = Object.entries(packageDemand).sort((left, right) => right[1] - left[1])[0];

  if (loading) {
    return (
      <div className="admin-loading-state admin-surface">
        <div>
          <Spinner animation="border" />
          <p className="mb-0">Loading your admin snapshot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-grid gap-4">
      <div className="admin-toolbar">
        <div className="admin-toolbar-copy">
          <h2>Overview</h2>
          <p>
            Monitor team activity, see how bookings are progressing, and spot the
            busiest parts of the business at a glance.
          </p>
        </div>

        <div className="admin-toolbar-actions">
          <button
            type="button"
            className="admin-secondary-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh snapshot'}
          </button>
        </div>
      </div>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <p className="admin-stat-label">Total users</p>
          <h3 className="admin-stat-value">{stats.totalUsers}</h3>
          <span className="admin-stat-meta">Registered travelers</span>
        </article>

        <article className="admin-stat-card">
          <p className="admin-stat-label">Live packages</p>
          <h3 className="admin-stat-value">{stats.totalPackages}</h3>
          <span className="admin-stat-meta">Trips currently available</span>
        </article>

        <article className="admin-stat-card">
          <p className="admin-stat-label">Pending requests</p>
          <h3 className="admin-stat-value">{pendingBookings}</h3>
          <span className="admin-stat-meta">Need review from your team</span>
        </article>

        <article className="admin-stat-card">
          <p className="admin-stat-label">Approved revenue</p>
          <h3 className="admin-stat-value">{formatCurrency(approvedRevenue)}</h3>
          <span className="admin-stat-meta">Approved package bookings</span>
        </article>
      </section>

      <section className="admin-mini-stats-grid">
        <article className="admin-surface">
          <p className="admin-stat-label">Booking pipeline</p>
          <h3 className="admin-stat-value">{totalBookings}</h3>
          <span className="admin-stat-meta">All booking requests received</span>
        </article>

        <article className="admin-surface">
          <p className="admin-stat-label">Approval rate</p>
          <h3 className="admin-stat-value">{approvalRate}%</h3>
          <span className="admin-stat-meta">{approvedBookings.length} approved so far</span>
        </article>

        <article className="admin-surface">
          <p className="admin-stat-label">Active travelers</p>
          <h3 className="admin-stat-value">{uniqueTravelers}</h3>
          <span className="admin-stat-meta">Unique customers with bookings</span>
        </article>
      </section>

      <section className="admin-layout-grid">
        <article className="admin-surface">
          <div className="admin-toolbar mb-0">
            <div className="admin-toolbar-copy">
              <h2>Recent bookings</h2>
              <p>The latest requests coming through the dashboard.</p>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="admin-empty-state">
              <div>
                <h3 className="admin-section-heading">No bookings yet</h3>
                <p className="admin-section-subtitle">
                  Once customers start booking packages, they will show up here.
                </p>
              </div>
            </div>
          ) : (
            <div className="admin-recent-list">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="admin-recent-item">
                  <div className="admin-booking-copy">
                    <strong>{booking.user?.name || `Traveler #${booking.user_id}`}</strong>
                    <span>{booking.tour_package?.title || `Package #${booking.tour_package_id}`}</span>
                    <small>{formatDate(booking.booking_date)}</small>
                  </div>

                  <div className="text-end">
                    <span className={`admin-status-badge ${booking.status}`}>{booking.status}</span>
                    <small className="d-block mt-2">{formatCurrency(booking.total_price)}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="admin-surface">
          <div className="admin-toolbar mb-0">
            <div className="admin-toolbar-copy">
              <h2>Operational insights</h2>
              <p>Quick signals to help prioritize work today.</p>
            </div>
          </div>

          <div className="admin-insight-list">
            <div className="admin-insight-item">
              <div>
                <strong>Most requested package</strong>
                <span>
                  {topPackageEntry ? topPackageEntry[0] : 'No package demand yet'}
                </span>
              </div>
              <div className="admin-highlight-number">
                {topPackageEntry ? topPackageEntry[1] : 0}
              </div>
            </div>

            <div className="admin-insight-item">
              <div>
                <strong>Rejected bookings</strong>
                <span>Requests that may need follow-up or clearer package details</span>
              </div>
              <div className="admin-highlight-number">{rejectedBookings.length}</div>
            </div>

            <div className="admin-insight-item">
              <div>
                <strong>Pending queue</strong>
                <span>How much approval work is still waiting on the team</span>
              </div>
              <div className="admin-highlight-number">{pendingBookings}</div>
            </div>

            <div className="admin-insight-item">
              <div>
                <strong>Revenue card note</strong>
                <span>
                  Revenue is calculated from approved package bookings so the metric stays
                  useful even before payment automation is connected.
                </span>
              </div>
              <div className="admin-highlight-number">{formatCurrency(approvedRevenue)}</div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default DashboardOverview;
