import { Navigate, Outlet } from 'react-router-dom';
import ApiClient from './api';

const ProtectedRoute = () => {
  const isAuthenticated = ApiClient.isAuthenticated();
  const isSuperAdmin = ApiClient.isSuperAdmin();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
