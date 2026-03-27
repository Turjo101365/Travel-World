import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

const CustomerPortal: React.FC = () => {
  const location = useLocation();

  return (
    <Container className="py-5 mt-4 mb-5">
      <Row className="g-4">
        <Col md={3}>
          <div className="bg-white p-4 rounded-4 shadow-sm border border-light">
            <h5 className="fw-bold mb-4 text-primary text-uppercase px-2">Account Portal</h5>
            <Nav className="flex-column nav-pills gap-2">
              <Nav.Link as={Link} to="/profile" active={location.pathname === '/profile'} className="text-dark rounded-3 px-3 py-3 fw-medium" style={{ backgroundColor: location.pathname === '/profile' ? '#f0f4f8' : 'transparent', color: location.pathname === '/profile' ? '#0d6efd !important' : '' }}>
                👤 My Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/portal/history" active={location.pathname === '/portal/history'} className="text-dark rounded-3 px-3 py-3 fw-medium" style={{ backgroundColor: location.pathname === '/portal/history' ? '#f0f4f8' : 'transparent', color: location.pathname === '/portal/history' ? '#0d6efd !important' : '' }}>
                🏷️ Booking History
              </Nav.Link>
            </Nav>
          </div>
        </Col>
        <Col md={9}>
          <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light min-vh-50 h-100">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerPortal;
