import React, { useState, useEffect } from 'react';
import { AdminContext } from './AdminContext';

const API_URL = 'http://localhost:8080/api';

export const AdminProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();

      const productosFormateados = data.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion || '',
        origen: producto.origen || '',
        notasCata: producto.notasCata || '',
        categoria: producto.categoriaNombre?.toLowerCase() || 'roll',
        categoriaId: producto.categoriaId,
        disponible: producto.activo,
        imagen: producto.imagenUrl || '/src/assets/images/default.jpg',
        ingredientes: []
      }));

      setProductos(productosFormateados);
    } catch (error) {
      console.error('Error al cargar productos:', error);
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
      console.error('Error al cargar categorías:', error);
    }
  };

  // Login CONECTADO A BASE DE DATOS
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminUser', JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          rol: data.rol
        }));
        setUser(data);
        return true;
      } else {
        console.error('Error de login:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    setUser(null);
    setProductos([]);
  };

  const agregarProducto = async (producto) => {
    try {
      const categoriaSeleccionada = categorias.find(
        c => c.nombre.toLowerCase() === producto.categoria.toLowerCase()
      );

      const productoBackend = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        origen: producto.origen,
        notasCata: producto.notasCata,
        precio: parseFloat(producto.precio),
        imagenUrl: producto.imagen,
        activo: producto.disponible,
        categoriaId: categoriaSeleccionada?.id || 2,
        categoriaNombre: producto.categoria
      };

      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoBackend)
      });

      if (!response.ok) throw new Error('Error al crear producto');

      await cargarProductos();
      return true;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  };

  const editarProducto = async (id, productoActualizado) => {
    try {
      const categoriaSeleccionada = categorias.find(
        c => c.nombre.toLowerCase() === productoActualizado.categoria.toLowerCase()
      );

      const productoBackend = {
        nombre: productoActualizado.nombre,
        descripcion: productoActualizado.descripcion,
        origen: productoActualizado.origen,
        notasCata: productoActualizado.notasCata,
        precio: parseFloat(productoActualizado.precio),
        imagenUrl: productoActualizado.imagen,
        activo: productoActualizado.disponible,
        categoriaId: categoriaSeleccionada?.id || 2,
        categoriaNombre: productoActualizado.categoria
      };

      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoBackend)
      });

      if (!response.ok) throw new Error('Error al editar producto');

      await cargarProductos();
    } catch (error) {
      console.error('Error al editar producto:', error);
      throw error;
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar producto');

        await cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const value = {
    productos,
    categorias,
    isAuthenticated,
    loading,
    user,
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