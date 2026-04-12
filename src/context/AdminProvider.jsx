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

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Productos recibidos del backend:', data);

      // Si data es un array, procesarlo
      const productosFormateados = Array.isArray(data) ? data.map(producto => ({
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
        ingredientes: producto.ingredientes || []
      })) : [];

      setProductos(productosFormateados);

    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]); // Vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/productos/categorias`);
      if (response.ok) {
        const data = await response.json();
        console.log('Categorías desde backend:', data);
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  // ✅ FUNCIÓN LOGIN CORREGIDA
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', 'logged_in');
        localStorage.setItem('userRol', data.rol);
        localStorage.setItem('userName', data.nombre);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('user', JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          rol: data.rol
        }));

        setIsAuthenticated(true);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRol');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUser(null);
    setProductos([]);
  };

  const agregarProducto = async (producto) => {
    try {
      const categoriaSeleccionada = categorias.find(
        c => c.nombre.toLowerCase() === producto.categoria.toLowerCase()
      );

      if (!categoriaSeleccionada) {
        console.error('❌ Categoría no encontrada:', producto.categoria);
        alert(`Categoría "${producto.categoria}" no existe en la base de datos`);
        return;
      }

      const productoBackend = {
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        origen: producto.origen || '',
        notasCata: producto.notasCata || '',
        precio: parseFloat(producto.precio),
        imagenUrl: producto.imagen,
        activo: true,
        categoriaId: categoriaSeleccionada.id
      };

      console.log('Enviando al backend:', productoBackend);

      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        descripcion: productoActualizado.descripcion || '',
        origen: productoActualizado.origen || '',
        notasCata: productoActualizado.notasCata || '',
        precio: parseFloat(productoActualizado.precio),
        imagenUrl: productoActualizado.imagen || '',
        activo: true,
        categoriaId: categoriaSeleccionada?.id || 2
      };

      console.log('✏️ Editando producto:', { id, productoBackend });

      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoBackend)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Producto actualizado:', data);

      await cargarProductos();
      return data;
    } catch (error) {
      console.error('❌ Error al editar producto:', error);
      throw error;
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