import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // Settings and onboarding work even without GitHub connection
  return <>{children}</>;
}

export function RequireGitHub({ children }: { children: React.ReactNode }) {
  const { configured, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!configured) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
