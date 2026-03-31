import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      setUsuario(JSON.parse(usuarioStorage));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Credenciales simples para demo
    if (email === 'admin@sushiroom.com' && password === 'admin123') {
      const usuarioData = {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@sushiroom.com',
        role: 'admin'
      };
      setUsuario(usuarioData);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const value = {
    usuario,
    loading,
    login,
    logout,
    isAuthenticated: !!usuario,
    isAdmin: usuario?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};