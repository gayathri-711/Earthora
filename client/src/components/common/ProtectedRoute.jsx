import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-earthora-forest border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback =
      user.role === 'admin'
        ? '/dashboard/admin'
        : user.role === 'farmer'
        ? '/dashboard/farmer'
        : user.role === 'expert'
        ? '/dashboard/expert'
        : '/dashboard/customer';
    return <Navigate to={fallback} replace />;
  }

  return children;
}
