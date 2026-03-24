// src/pages/CarritoResumen/CarritoResumen.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CarritoContext';
import styles from './CarritoResumen.module.css';

const CarritoResumen = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal, notification } = useCart();
  const [itemToDelete, setItemToDelete] = useState(null); // Estado para el modal de confirmación

  const handleProcederPago = () => {
    navigate('/checkout');
  };

  const handleEliminarClick = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmarEliminar = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const handleCancelarEliminar = () => {
    setItemToDelete(null);
  };

  if (cart.length === 0) {
    return (
      <div className={styles.carritoVacio}>
        <h2>Tu carrito está vacío</h2>
        <p>¿Listo para pedir? Explora nuestro menú</p>
        <Link to="/menu" className={styles.btnMenu}>
          Ver menú
        </Link>
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

      {/* Modal de confirmación */}
      {itemToDelete && (
        <div className={styles.modalOverlay} onClick={handleCancelarEliminar}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>¿Eliminar producto?</h3>
            <p>¿Estás seguro de que quieres eliminar <strong>{itemToDelete.nombre}</strong> de tu carrito?</p>
            <div className={styles.modalButtons}>
              <button onClick={handleCancelarEliminar} className={styles.modalBtnCancelar}>
                Cancelar
              </button>
              <button onClick={handleConfirmarEliminar} className={styles.modalBtnConfirmar}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.resumen}>
        <h1>Resumen de tu Carrito</h1>
        
        {/* Lista de productos */}
        <div className={styles.lista}>
          {cart.map(item => (
            <div key={item.id} className={styles.item}>
              <img src={item.imagen} alt={item.nombre} className={styles.imagen} />
              
              <div className={styles.info}>
                <h3>{item.nombre}</h3>
                <p className={styles.precio}>${item.precio} MXN c/u</p>
              </div>
              
              <div className={styles.cantidad}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className={styles.btnCantidad}
                  disabled={item.quantity <= 1}
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className={styles.btnCantidad}
                >+</button>
              </div>
              
              <p className={styles.subtotal}>${item.precio * item.quantity} MXN</p>
              
              <button 
                onClick={() => handleEliminarClick(item)}
                className={styles.btnEliminar}
                title="Eliminar"
              >✕</button>
            </div>
          ))}
        </div>
        
        {/* Total y botón */}
        <div className={styles.footer}>
          <div className={styles.total}>
            <span>Total a pagar:</span>
            <span className={styles.totalMonto}>${getCartTotal()} MXN</span>
          </div>
          
          <button 
            onClick={handleProcederPago}
            className={styles.btnPago}
          >
            Proceder al pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoResumen;