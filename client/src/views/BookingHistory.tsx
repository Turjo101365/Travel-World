import React, { useEffect, useState } from 'react';
import { Table, Spinner, Badge, Alert } from 'react-bootstrap';
import ApiClient from '../api';

const BookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const api = new ApiClient();
      const data = await api.getMyBookings();
      setBookings(data || []);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <div className="booking-history-page">
      <h3 className="fw-bolder mb-4 text-dark">My Booking History</h3>
      {bookings.length === 0 ? (
        <Alert variant="info" className="booking-history-alert rounded-3 border-0 py-4 px-4 shadow-sm bg-light text-secondary">
          <i className="bi bi-info-circle me-2 fs-5"></i> You haven't made any bookings yet. Start exploring our amazing tour packages today!
        </Alert>
      ) : (
        <div className="booking-history-table-wrap table-responsive bg-white rounded-3">
          <Table hover className="align-middle border">
            <thead className="table-light text-muted">
              <tr>
                <th className="py-3 px-4 border-0">Tour Package</th>
                <th className="py-3 border-0">Date</th>
                <th className="py-3 border-0">Guests</th>
                <th className="py-3 border-0">Total Cost</th>
                <th className="py-3 text-end px-4 border-0">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-bottom">
                  <td className="px-4 py-3 fw-medium text-primary">
                    {booking.tour_package?.title || `Package #${booking.tour_package_id}`}
                  </td>
                  <td className="py-3 text-secondary fw-medium">{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td className="py-3 text-secondary">{booking.participants}</td>
                  <td className="py-3 fw-bold text-dark">${Number(booking.total_price).toFixed(2)}</td>
                  <td className="text-end px-4 py-3">
                    <Badge pill bg={booking.status === 'approved' ? 'success' : booking.status === 'rejected' ? 'danger' : 'warning'} className="px-3 py-2 text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                      {booking.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
