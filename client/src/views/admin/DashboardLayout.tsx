import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import ApiClient from '../../api';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    ApiClient.logout();
    navigate('/login');
  };

  return (
    <Container fluid className="p-0 h-100 bg-light">
      <Row className="g-0 h-100 min-vh-100">
        <Col md={2} className="bg-dark text-white p-3">
          <h4 className="mb-4 mt-2 px-2 text-warning">TravelWorld Admin</h4>
          <Nav className="flex-column nav-pills mt-4">
            <Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'} className="text-white mb-2 p-2">
              Dashboard Overview
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/packages" active={location.pathname === '/admin/packages'} className="text-white mb-2 p-2">
              Tour Packages
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/bookings" active={location.pathname === '/admin/bookings'} className="text-white mb-2 p-2">
              Bookings
            </Nav.Link>
            <hr className="bg-secondary" />
            <Nav.Link onClick={handleLogout} className="text-danger mt-2 p-2 fw-bold" style={{ cursor: 'pointer' }}>
              Logout
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="p-4" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardLayout;
