import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import ApiClient from '../../api';
import toast from 'react-hot-toast';

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const api = new ApiClient();
      const data = await api.getDashboardStats();
      if (data) {
        setStats(data);
      } else {
        toast.error('Failed to load stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      <Row className="mt-4 g-4">
        {[
          { title: 'Total Users', value: stats?.totalUsers || 0, bg: 'primary' },
          { title: 'Tour Packages', value: stats?.totalPackages || 0, bg: 'success' },
          { title: 'Pending Bookings', value: stats?.pendingBookings || 0, bg: 'warning' },
          { title: 'Total Revenue', value: `$${Number(stats?.totalRevenue || 0).toFixed(2)}`, bg: 'info' }
        ].map((item, index) => (
          <Col md={3} key={index}>
            <Card bg={item.bg} text={item.bg === 'warning' ? 'dark' : 'white'} className="text-center h-100 shadow-sm border-0">
              <Card.Body className="d-flex flex-column justify-content-center py-5">
                <Card.Title className="fs-5 fw-light text-uppercase mb-3">{item.title}</Card.Title>
                <Card.Text style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{item.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardOverview;
