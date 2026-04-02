import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

const PrivateRoute = ({ children, rolRequerido }) => {
  const { isAuthenticated, user } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (rolRequerido && user?.rol !== rolRequerido) {
    if (user?.rol === 'admin') {
      return <Navigate to="/admin/panel" />;
    }
    if (user?.rol === 'empleado') {
      return <Navigate to="/empleado/panel" />;
    }
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;