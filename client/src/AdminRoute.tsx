import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ApiClient from './api';

const AdminRoute = () => {
  const location = useLocation();
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(
    ApiClient.isAuthenticated() && !ApiClient.isAdmin()
  );
  const [isAllowed, setIsAllowed] = useState(ApiClient.isAdmin());

  useEffect(() => {
    if (!ApiClient.isAuthenticated() || ApiClient.isAdmin()) {
      return;
    }

    let isMounted = true;

    const verifyAdminAccess = async () => {
      const api = new ApiClient();
      const response = await api.getMe();

      if (!isMounted) {
        return;
      }

      const isAdminUser = response?.status === 'success' && response.user?.role === 'admin';
      setIsAllowed(isAdminUser);
      setIsCheckingAdmin(false);
    };

    void verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!ApiClient.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isCheckingAdmin) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3 mb-0 text-muted">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    return <Navigate to="/profile" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default AdminRoute;
