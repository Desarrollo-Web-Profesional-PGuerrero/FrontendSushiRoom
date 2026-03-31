import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

const AdminRoute = ({ children }) => {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;