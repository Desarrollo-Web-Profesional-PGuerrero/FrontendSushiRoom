import React, { useState, useEffect } from 'react';
import { AdminContext } from './AdminContext';

const API_URL = 'http://localhost:8080/api';

export const AdminProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem('user');
    return user !== null;
  });
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      cargarProductos();
      cargarCategorias();
    }
  }, [isAuthenticated]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/productos`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/productos/categorias`);
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify({
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }));
      setUser({ nombre: data.nombre, email: data.email, rol: data.rol });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    setUser(null);
    setProductos([]);
  };

  const agregarProducto = async (producto) => {
    try {
      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      if (response.ok) {
        await cargarProductos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const editarProducto = async (id, producto) => {
    try {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });
      if (response.ok) {
        await cargarProductos();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await fetch(`${API_URL}/productos/${id}`, { method: 'DELETE' });
        await cargarProductos();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const value = {
    productos,
    categorias,
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    agregarProducto,
    editarProducto,
    eliminarProducto,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};