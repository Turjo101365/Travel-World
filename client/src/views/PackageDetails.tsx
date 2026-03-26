import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import ApiClient, { TourPackageRecord } from '../api';
import toast from 'react-hot-toast';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<TourPackageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      const api = new ApiClient();
      const data = await api.getPackage(Number(id));
      setPkg(data);
      setLoading(false);
    };
    fetchPackage();
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ApiClient.isAuthenticated()) {
      toast.error('Please login to book a package');
      navigate('/login', { state: { returnUrl: `/packages/${id}` } });
      return;
    }
    setBookingLoading(true);
    const api = new ApiClient();
    try {
      await api.createBooking({
        tour_package_id: Number(id),
        booking_date: bookingDate,
        participants: participants
      });
      toast.success('Congratulations! Booking created successfully!');
      navigate('/portal/history');
    } catch {
      toast.error('Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="text-center py-5 mt-5"><Spinner animation="border" /></div>;
  if (!pkg) return <Container className="py-5 text-center mt-5"><h4>Package not found</h4></Container>;

  return (
    <div className="package-details-page">
      <Container className="package-details-shell py-5 mt-4 mb-5">
        <Row className="g-5">
          <Col lg={7}>
            {pkg.image_url ? (
              <img src={pkg.image_url} alt={pkg.title} className="img-fluid rounded-4 shadow mb-4 w-100" style={{ maxHeight: '450px', objectFit: 'cover' }} />
            ) : (
              <div className="package-image-fallback bg-light rounded-4 shadow mb-4 w-100 d-flex align-items-center justify-content-center text-muted" style={{ height: '300px' }}>
                <span className="fs-1">🖼️ No Image Provided</span>
              </div>
            )}
            <h1 className="fw-bolder mb-3 text-dark">{pkg.title}</h1>
            <div className="package-info-strip d-flex flex-wrap gap-4 mb-4 text-muted border-bottom pb-4">
              <span className="fs-5">📍 <strong className="text-dark">Location:</strong> {pkg.location}</span>
              <span className="fs-5">⏳ <strong className="text-dark">Duration:</strong> {pkg.duration} Days</span>
              <span className="fs-5">👥 <strong className="text-dark">Max Group:</strong> {pkg.max_participants}</span>
            </div>
            <h4 className="fw-bold mb-3 mt-4 text-primary">Overview</h4>
            <p className="package-description fs-5 text-secondary" style={{ lineHeight: '1.8' }}>
              {pkg.description}
            </p>
          </Col>
          <Col lg={5}>
            <Card className="package-booking-card shadow-lg border-0 rounded-4 sticky-top" style={{ top: '100px' }}>
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bolder text-success mb-0">${Number(pkg.price).toFixed(2)}</h2>
                  <span className="text-muted fw-medium">per person</span>
                </div>
                <hr className="my-4 text-light border-2 opacity-50" />
                <Form onSubmit={handleBook}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">Select Booking Date</Form.Label>
                    <Form.Control type="date" required size="lg" className="rounded-3" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark">Number of Participants</Form.Label>
                    <Form.Control type="number" min="1" max={pkg.max_participants} size="lg" className="rounded-3" required value={participants} onChange={(e) => setParticipants(Number(e.target.value))} />
                    <Form.Text className="text-muted">Maximum {pkg.max_participants} allowed per booking.</Form.Text>
                  </Form.Group>
                  
                  <div className="package-summary-box bg-light p-4 rounded-4 mb-4 mt-2">
                    <div className="d-flex justify-content-between mb-2 text-secondary">
                      <span>${Number(pkg.price).toFixed(2)} x {participants} guests</span>
                      <span>${(pkg.price * participants).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 text-secondary">
                      <span>Taxes & Fees</span>
                      <span>$0.00</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fs-4 fw-bold text-dark align-items-center">
                      <span>Total</span>
                      <span className="text-success">${(pkg.price * participants).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold rounded-pill shadow-sm" disabled={bookingLoading}>
                    {bookingLoading ? <Spinner size="sm" animation="border" /> : 'Confirm Booking'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PackageDetails;
