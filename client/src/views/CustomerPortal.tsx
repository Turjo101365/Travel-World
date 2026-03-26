import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

const CustomerPortal: React.FC = () => {
  const location = useLocation();
  const isProfileRoute = location.pathname === '/profile';
  const isHistoryRoute = location.pathname === '/portal/history';

  const getNavLinkClass = (isActive: boolean) =>
    `customer-portal-nav-link text-dark rounded-3 px-3 py-3 fw-medium${isActive ? ' active' : ''}`;

  return (
    <Container className="customer-portal-page py-5 mt-4 mb-5">
      <Row className="g-4">
        <Col md={3}>
          <div className="customer-portal-sidebar bg-white p-4 rounded-4 shadow-sm border border-light">
            <h5 className="fw-bold mb-4 text-primary text-uppercase px-2">Account Portal</h5>
            <Nav className="flex-column nav-pills gap-2">
              <Nav.Link as={Link} to="/profile" active={isProfileRoute} className={getNavLinkClass(isProfileRoute)}>
                👤 My Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/portal/history" active={isHistoryRoute} className={getNavLinkClass(isHistoryRoute)}>
                🏷️ Booking History
              </Nav.Link>
            </Nav>
          </div>
        </Col>
        <Col md={9}>
          <div className="customer-portal-content bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light min-vh-50 h-100">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerPortal;
