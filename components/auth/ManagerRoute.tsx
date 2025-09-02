import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ManagerRouteProps {
  children: ReactNode;
}

const ManagerRoute: React.FC<ManagerRouteProps> = ({ children }) => {
  const { currentUser, isManager } = useApp();

  if (!isManager(currentUser.id)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default ManagerRoute;
