import { Navigate } from 'react-router-dom';
import { getToken, getUser } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = getToken();
  const user = getUser();

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to their correct page
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case 'psychiatrist': return <Navigate to="/psychiatrist" replace />;
      case 'admin': return <Navigate to="/admin" replace />;
      default: return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
