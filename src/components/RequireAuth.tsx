// src/components/RequireAuth.tsx

import type {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router';
import {useAuth} from '../context/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
}

export const RequireAuth = ({children}: RequireAuthProps) => {
  const user = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return <>{children}</>;
};
