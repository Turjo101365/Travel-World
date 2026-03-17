import { Navigate, Outlet } from 'react-router-dom';
import ApiClient from './api';

const ProtectedRoute = () => {
  const isAuthenticated = ApiClient.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
