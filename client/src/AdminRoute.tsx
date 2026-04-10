import { Navigate, Outlet } from 'react-router-dom';
import ApiClient from './api';

const AdminRoute = () => {
  if (!ApiClient.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!ApiClient.isSuperAdmin()) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
