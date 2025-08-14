
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Permission } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  permission: Permission;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const { hasPermission } = useApp();

  if (!hasPermission(permission)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
