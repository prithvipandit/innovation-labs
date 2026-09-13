import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, role: userRole, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // While the profile (and therefore role) is still loading, don't bounce the
  // user away from a role-gated route just because we don't know it yet.
  if (role && user && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
