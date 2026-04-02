// src/context/AdminContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
  getProductos, 
  createProducto, 
  updateProducto, 
  deleteProducto,
  toggleDisponibilidadProducto 
} from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();
      console.log('📦 Productos cargados en contexto:', data);
      setProductos(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (productoData) => {
    console.log('🟢 AdminContext - agregarProducto llamado');
    console.log('📦 ProductoData recibido:', productoData);
    
    try {
      const nuevoProducto = await createProducto(productoData);
      console.log('✅ Producto creado exitosamente:', nuevoProducto);
      setProductos([...productos, nuevoProducto]);
      return nuevoProducto;
    } catch (err) {
      console.error('❌ Error en agregarProducto:', err);
      throw err;
    }
  };

  const editarProducto = async (id, productoData) => {
    try {
      const productoActualizado = await updateProducto(id, productoData);
      setProductos(productos.map(p => p.id === id ? productoActualizado : p));
      return productoActualizado;
    } catch (err) {
      console.error('Error al editar producto:', err);
      throw err;
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteProducto(id);
      setProductos(productos.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      throw err;
    }
  };

  const toggleDisponibilidad = async (id) => {
    try {
      const productoActualizado = await toggleDisponibilidadProducto(id);
      setProductos(productos.map(p => p.id === id ? productoActualizado : p));
    } catch (err) {
      console.error('Error al cambiar disponibilidad:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
  };

  return (
    <AdminContext.Provider value={{
      productos,
      loading,
      error,
      agregarProducto,
      editarProducto,
      eliminarProducto,
      toggleDisponibilidad,
      logout,
      cargarProductos
    }}>
      {children}
    </AdminContext.Provider>
  );
};