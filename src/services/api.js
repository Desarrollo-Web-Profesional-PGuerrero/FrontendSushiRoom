// src/services/api.js
const API_URL = 'http://localhost:8080/api'; // Spring Boot corre en puerto 8080

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