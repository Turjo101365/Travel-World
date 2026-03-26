import React, { useEffect, useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ApiClient from '../../api';
import '../../css/admin-dashboard.css';

const navigationItems = [
  {
    to: '/admin',
    label: 'Overview',
    hint: 'Live totals, trends, and quick insights',
    badge: '01',
    end: true,
  },
  {
    to: '/admin/packages',
    label: 'Packages',
    hint: 'Create, update, and publish new tours',
    badge: '02',
  },
  {
    to: '/admin/bookings',
    label: 'Bookings',
    hint: 'Approve requests and monitor activity',
    badge: '03',
  },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const currentUser = ApiClient.getUser();
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    setShowSidebar(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const api = new ApiClient();
    await api.logout();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <>
      <div className="admin-brand">
        <span className="admin-brand-mark">TW</span>
        <div>
          <p className="admin-brand-kicker">TravelWorld</p>
          <h2 className="admin-brand-title">Admin Dashboard</h2>
        </div>
      </div>

      <div className="admin-sidebar-intro">
        <span className="admin-sidebar-date">{todayLabel}</span>
        <p className="mb-0">
          Manage tour inventory, booking approvals, and daily operations without leaving
          this control center.
        </p>
      </div>

      <nav className="admin-nav-list">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-nav-link${isActive ? ' active' : ''}`
            }
          >
            <span className="admin-nav-badge">{item.badge}</span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.hint}</small>
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link to="/" className="admin-sidebar-link">
          Open Public Site
        </Link>
        <Link to="/profile" className="admin-sidebar-link">
          View My Profile
        </Link>
        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar d-none d-lg-flex">{sidebarContent}</aside>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="start"
        className="admin-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="admin-offcanvas-title">TravelWorld Admin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{sidebarContent}</Offcanvas.Body>
      </Offcanvas>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-copy">
            <Button
              type="button"
              variant="link"
              className="admin-sidebar-toggle d-lg-none"
              onClick={() => setShowSidebar(true)}
            >
              Menu
            </Button>
            <p className="admin-kicker">TravelWorld operations hub</p>
            <h1 className="admin-page-title">
              Track bookings, manage packages, and keep the travel pipeline moving.
            </h1>
            <p className="admin-page-subtitle">
              Everything your team needs is organized here, from incoming requests to live
              catalog updates.
            </p>
          </div>

          <div className="admin-topbar-actions">
            <div className="admin-user-card">
              <span className="admin-user-label">Signed in as</span>
              <strong>{currentUser?.name || 'Admin user'}</strong>
              <span>{currentUser?.email || 'No email available'}</span>
            </div>

            <div className="admin-quick-actions">
              <Link to="/" className="admin-ghost-btn">
                Public site
              </Link>
              <Link to="/profile" className="admin-ghost-btn">
                Profile
              </Link>
            </div>
          </div>
        </header>

        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;
