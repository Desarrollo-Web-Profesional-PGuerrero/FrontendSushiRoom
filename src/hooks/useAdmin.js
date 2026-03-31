import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin debe ser usado dentro de un AdminProvider');
  }
  return context;
};