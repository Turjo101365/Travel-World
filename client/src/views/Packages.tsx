import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient, { TourPackageRecord } from '../api';

const Packages: React.FC = () => {
  const [packages, setPackages] = useState<TourPackageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      const api = new ApiClient();
      const data = await api.getPackages();
      setPackages(data || []);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  return (
    <div className="packages-page">
      <Container className="packages-shell py-5">
        <h2 className="packages-heading text-center mb-5 fw-bold mt-4">Explore Our Amazing Tours</h2>
      {loading ? <div className="text-center py-5"><Spinner animation="border" /></div> : (
        <Row className="g-4 mb-5">
          {packages.length === 0 && <p className="text-center text-muted fs-5">No tour packages available.</p>}
          {packages.map((pkg) => (
            <Col md={4} key={pkg.id}>
              <Card className="h-100 shadow-sm border-0 border-top border-primary border-4" style={{ transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                {pkg.image_url ? (
                  <Card.Img variant="top" src={pkg.image_url} style={{ height: '220px', objectFit: 'cover' }} />
                ) : (
                  <div className="bg-light text-muted d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
                    <span className="fs-1">🗺️</span>
                  </div>
                )}
                <Card.Body className="d-flex flex-column p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="fw-bold fs-5 mb-0 lh-sm me-2">{pkg.title}</Card.Title>
                    <span className="text-success fw-bold fs-5">${Number(pkg.price).toFixed(0)}</span>
                  </div>
                  <Card.Text className="text-muted small fw-medium mb-3">
                    📍 {pkg.location} • ⏳ {pkg.duration} Days
                  </Card.Text>
                  <Card.Text className="flex-grow-1 text-secondary mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {pkg.description}
                  </Card.Text>
                  <Button variant="primary" className="mt-auto w-100 fw-bold rounded-pill shadow-sm" onClick={() => navigate(`/packages/${pkg.id}`)}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      </Container>
    </div>
  );
};

export default Packages;
