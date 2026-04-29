import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/Authcontex';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
