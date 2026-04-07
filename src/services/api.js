// src/services/api.js

// URL base de tu API backend
// En desarrollo: localhost:8080
// En producción: variable de entorno de Railway
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ==================== PRODUCTOS ====================

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Productos cargados:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
    return [];
  }
};

// Obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error al cargar producto:', error);
    return null;
  }
};

// Crear nuevo producto (solo admin)
export const crearProducto = async (productoData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productoData)
    });
    if (!response.ok) throw new Error('Error al crear producto');
    return await response.json();
  } catch (error) {
    console.error('❌ Error en crearProducto:', error);
    throw error;
  }
};

// Actualizar producto (solo admin)
export const actualizarProducto = async (id, productoData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productoData)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return await response.json();
  } catch (error) {
    console.error('❌ Error en actualizarProducto:', error);
    throw error;
  }
};

// Eliminar producto (solo admin)
export const eliminarProducto = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al eliminar producto');
    return await response.json();
  } catch (error) {
    console.error('❌ Error en eliminarProducto:', error);
    throw error;
  }
};

// ==================== PEDIDOS ====================

// Obtener pedido por ID
export const getPedidoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/pedidos/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error al cargar pedido:', error);
    return null;
  }
};