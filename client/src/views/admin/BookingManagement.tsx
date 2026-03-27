import React, { useEffect, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import ApiClient, { BookingRecord, BookingStatus } from '../../api';
import toast from 'react-hot-toast';

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

const statusOptions: Array<{ value: 'all' | BookingStatus; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');

  const fetchBookings = async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const api = new ApiClient();
    const data = await api.getAdminBookings();
    setBookings(data);

    if (mode === 'initial') {
      setLoading(false);
    } else {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    setProcessingId(id);
    const api = new ApiClient();

    try {
      await api.updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status}.`);
      await fetchBookings('refresh');
    } catch {
      toast.error('Failed to update booking status.');
    } finally {
      setProcessingId(null);
    }
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        booking.user?.name || `Traveler #${booking.user_id}`,
        booking.user?.email || '',
        booking.tour_package?.title || `Package #${booking.tour_package_id}`,
        String(booking.id),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookings.filter((booking) => booking.status === 'pending').length;
  const approvedCount = bookings.filter((booking) => booking.status === 'approved').length;
  const rejectedCount = bookings.filter((booking) => booking.status === 'rejected').length;
  const approvedRevenue = bookings
    .filter((booking) => booking.status === 'approved')
    .reduce((sum, booking) => sum + Number(booking.total_price || 0), 0);

  return (
    <div className="d-grid gap-4">
      <div className="admin-toolbar">
        <div className="admin-toolbar-copy">
          <h2>Booking management</h2>
          <p>
            Review incoming requests, keep the queue moving, and spot approval bottlenecks
            before they slow the team down.
          </p>
        </div>

        <div className="admin-toolbar-actions">
          <input
            type="search"
            className="admin-search"
            placeholder="Search by traveler, email, package, or booking ID"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            className="admin-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | BookingStatus)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={() => fetchBookings('refresh')}
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <section className="admin-mini-stats-grid">
        <article className="admin-surface">
          <p className="admin-stat-label">Total bookings</p>
          <h3 className="admin-stat-value">{bookings.length}</h3>
          <span className="admin-stat-meta">Requests in the pipeline</span>
        </article>

        <article className="admin-surface">
          <p className="admin-stat-label">Pending reviews</p>
          <h3 className="admin-stat-value">{pendingCount}</h3>
          <span className="admin-stat-meta">Waiting for approval or rejection</span>
        </article>

        <article className="admin-surface">
          <p className="admin-stat-label">Approved revenue</p>
          <h3 className="admin-stat-value">{formatCurrency(approvedRevenue)}</h3>
          <span className="admin-stat-meta">
            {approvedCount} approved and {rejectedCount} rejected so far
          </span>
        </article>
      </section>

      <section className="admin-surface">
        <div className="admin-toolbar">
          <div className="admin-toolbar-copy">
            <h2>Booking queue</h2>
            <p>
              {filteredBookings.length} booking{filteredBookings.length === 1 ? '' : 's'} match
              the current filters.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-state">
            <div>
              <Spinner animation="border" />
              <p className="mb-0">Loading booking activity...</p>
            </div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <Table responsive className="admin-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Traveler</th>
                  <th>Package</th>
                  <th>Travel date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <div className="admin-empty-state">
                        <div>
                          <h3 className="admin-section-heading">No bookings found</h3>
                          <p className="admin-section-subtitle">
                            Try adjusting the filters or check back after customers place
                            new bookings.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="admin-booking-copy">
                        <strong>#{booking.id}</strong>
                        <span>{booking.participants} traveler{booking.participants === 1 ? '' : 's'}</span>
                        <small>Requested {formatDate(booking.created_at)}</small>
                      </div>
                    </td>
                    <td>
                      <div className="admin-booking-copy">
                        <strong>{booking.user?.name || `Traveler #${booking.user_id}`}</strong>
                        <span>{booking.user?.email || 'No email available'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-booking-copy">
                        <strong>{booking.tour_package?.title || `Package #${booking.tour_package_id}`}</strong>
                        <span>{booking.tour_package?.location || 'Location unavailable'}</span>
                      </div>
                    </td>
                    <td>{formatDate(booking.booking_date)}</td>
                    <td>{formatCurrency(booking.total_price)}</td>
                    <td>
                      <span className={`admin-status-badge ${booking.status}`}>{booking.status}</span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${booking.payment_status || 'processing'}`}>
                        {booking.payment_status || 'pending'}
                      </span>
                    </td>
                    <td className="text-end">
                      {booking.status === 'pending' ? (
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={() => handleStatusChange(booking.id, 'approved')}
                            disabled={processingId === booking.id}
                          >
                            {processingId === booking.id ? 'Working...' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            className="admin-secondary-btn"
                            onClick={() => handleStatusChange(booking.id, 'rejected')}
                            disabled={processingId === booking.id}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookingManagement;
