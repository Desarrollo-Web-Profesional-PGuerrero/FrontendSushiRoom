import React, { useState, useEffect } from 'react';
import { AdminContext } from './AdminContext';

// Datos iniciales de productos
const productosIniciales = [
  { id: 1, nombre: 'Salmón Nigiri', precio: 105, imagen: '/src/assets/images/salmon.jpg', disponible: true },
  { id: 2, nombre: 'Atún Nigiri', precio: 115, imagen: '/src/assets/images/tuna.jpg', disponible: true },
  { id: 3, nombre: 'Roll California', precio: 125, imagen: '/src/assets/images/california.png', disponible: true },
  { id: 4, nombre: 'Roll Spicy Tuna', precio: 130, imagen: '/src/assets/images/spicy.jpg', disponible: true },
  { id: 5, nombre: 'Sashimi Salmón', precio: 120, imagen: '/src/assets/images/sashimi.png', disponible: true },
  { id: 6, nombre: 'Ebi Roll', precio: 110, imagen: '/src/assets/images/ebi.jpg', disponible: true },
];

export const AdminProvider = ({ children }) => {
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('productos');
    return guardados ? JSON.parse(guardados) : productosIniciales;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });

  // Guardar productos en localStorage
  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(productos));
  }, [productos]);

  // Guardar estado de autenticación
  useEffect(() => {
    localStorage.setItem('adminAuth', isAuthenticated);
  }, [isAuthenticated]);

  // Login
  const login = (email, password) => {
    if (email === 'admin@sushiroom.com' && password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
  };

  // Agregar producto
  const agregarProducto = (producto) => {
    const nuevoId = Math.max(...productos.map(p => p.id), 0) + 1;
    setProductos([...productos, { ...producto, id: nuevoId }]);
  };

  // Editar producto
  const editarProducto = (id, productoActualizado) => {
    setProductos(productos.map(p => p.id === id ? { ...productoActualizado, id } : p));
  };

  // Eliminar producto
  const eliminarProducto = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  // Cambiar disponibilidad
  const toggleDisponibilidad = (id) => {
    setProductos(productos.map(p => p.id === id ? { ...p, disponible: !p.disponible } : p));
  };

  const value = {
    productos,
    isAuthenticated,
    login,
    logout,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    toggleDisponibilidad
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};