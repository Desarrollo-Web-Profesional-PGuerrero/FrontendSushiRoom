// src/pages/ProductoDetalle/ProductoDetalle.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CarritoContext';
import { getProductoById } from '../../services/api';
import styles from './ProductoDetalle.module.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, notification } = useCart();

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const data = await getProductoById(id);
      
      if (data) {
        // Transformar datos al formato del frontend
        const productoFormateado = {
          id: data.id,
          nombre: data.nombre,
          precio: parseFloat(data.precio),
          imagen: data.imagenUrl || '/images/default.jpg',
          descripcion: data.descripcion || 'Delicioso platillo de nuestra cocina',
          origen: data.origen || 'Preparado con los mejores ingredientes',
          notasCata: data.notasCata || 'Sabor excepcional que deleitará tu paladar',
          ingredientes: data.ingredientes || ['Arroz', 'Alga nori', 'Pescado fresco']
        };
        setProducto(productoFormateado);
        setError(null);
      } else {
        setError('Producto no encontrado');
      }
    } catch (err) {
      console.error('Error al cargar producto:', err);
      setError('No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarCarrito = () => {
    // Agregar producto al carrito con la cantidad seleccionada
    addToCart(producto, cantidad);
  };

  if (loading) {
    return <div className={styles.loading}>Cargando producto...</div>;
  }

  if (error) {
    return (
      <div className={styles.notFound}>
        <h2>{error}</h2>
        <button onClick={() => navigate('/menu')} className={styles.backButton}>
          Volver al menú
        </button>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className={styles.notFound}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/menu')} className={styles.backButton}>
          Volver al menú
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Notificación flotante */}
      {notification.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Volver
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            className={styles.image}
            onError={(e) => {
              e.target.src = '/images/default.jpg';
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <p className={styles.precio}>${producto.precio.toFixed(2)} MXN</p>

          <div className={styles.section}>
            <h3>Descripción</h3>
            <p>{producto.descripcion}</p>
          </div>

          <div className={styles.section}>
            <h3>Origen</h3>
            <p>{producto.origen}</p>
          </div>

          <div className={styles.section}>
            <h3>Notas de cata</h3>
            <p>{producto.notasCata}</p>
          </div>

          <div className={styles.section}>
            <h3>Ingredientes</h3>
            <ul className={styles.ingredientesList}>
              {Array.isArray(producto.ingredientes) ? (
                producto.ingredientes.map((ingrediente, index) => (
                  <li key={index}>{ingrediente}</li>
                ))
              ) : (
                <li>Información de ingredientes no disponible</li>
              )}
            </ul>
          </div>

          <div className={styles.carritoSection}>
            <div className={styles.cantidadControl}>
              <label htmlFor="cantidad">Cantidad:</label>
              <div className={styles.cantidadInput}>
                <button 
                  onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  className={styles.cantidadBtn}
                >-</button>
                <span>{cantidad}</span>
                <button 
                  onClick={() => setCantidad(prev => prev + 1)}
                  className={styles.cantidadBtn}
                >+</button>
              </div>
            </div>

            <button 
              onClick={handleAgregarCarrito}
              className={styles.agregarBtn}
            >
              Agregar al carrito - ${(producto.precio * cantidad).toFixed(2)} MXN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;