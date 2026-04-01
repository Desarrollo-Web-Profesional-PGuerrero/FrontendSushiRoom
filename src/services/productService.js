// URL base de tu API backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error('Error al cargar productos');
    return await response.json();
  } catch (error) {
    console.error('Error en getProductos:', error);
    throw error;
  }
};

// Obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) throw new Error('Producto no encontrado');
    return await response.json();
  } catch (error) {
    console.error('Error en getProductoById:', error);
    throw error;
  }
};

// Crear nuevo producto (solo admin)
export const crearProducto = async (productoData) => {
  try {
    const token = localStorage.getItem('token'); // Si usas JWT
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
    console.error('Error en crearProducto:', error);
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
    console.error('Error en actualizarProducto:', error);
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
    console.error('Error en eliminarProducto:', error);
    throw error;
  }
};