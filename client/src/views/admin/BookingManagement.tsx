import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Badge, Card } from 'react-bootstrap';
import ApiClient from '../../api';
import toast from 'react-hot-toast';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const api = new ApiClient();
    const data = await api.getAdminBookings();
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const api = new ApiClient();
    try {
      await api.updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status}`);
      fetchBookings();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Booking Management</h2>
      
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {loading ? <div className="text-center p-5"><Spinner animation="border" /></div> : (
            <Table responsive striped hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="py-3">User</th>
                  <th className="py-3">Package</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Pax</th>
                  <th className="py-3">Total Amount</th>
                  <th className="py-3">Status</th>
                  <th className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-4 text-muted">No bookings found.</td>
                  </tr>
                )}
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 align-middle">{booking.id}</td>
                    <td className="align-middle">{booking.user?.name || booking.user_id}</td>
                    <td className="align-middle fw-medium">{booking.tour_package?.title || `Package #${booking.tour_package_id}`}</td>
                    <td className="align-middle">{new Date(booking.booking_date).toLocaleDateString()}</td>
                    <td className="align-middle">{booking.participants}</td>
                    <td className="align-middle fw-bold">${Number(booking.total_price).toFixed(2)}</td>
                    <td className="align-middle">
                      <Badge bg={booking.status === 'approved' ? 'success' : booking.status === 'rejected' ? 'danger' : 'warning'}>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 align-middle text-end">
                      {booking.status === 'pending' ? (
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="outline-success" size="sm" onClick={() => handleStatusChange(booking.id, 'approved')}>
                            Approve
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleStatusChange(booking.id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted small">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookingManagement;
