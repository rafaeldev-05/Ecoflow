import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'gestor' | 'operacional')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  // 1️⃣ Enquanto carrega auth / role
  if (isLoading) {
    return <PageLoader />;
  }

  // 2️⃣ Não autenticado → login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // 3️⃣ Autenticado, mas role ainda não chegou
  if (!role) {
    return <PageLoader />;
  }

  // 4️⃣ Role não permitida
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 5️⃣ Tudo OK
  return <>{children}</>;
}
