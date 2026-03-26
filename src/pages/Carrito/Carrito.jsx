import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../hooks/useCarrito';
import styles from './Carrito.module.css';

const Carrito = () => {
  const navigate = useNavigate();
  const { carrito, totalItems, totalPrecio, actualizarCantidad, eliminarDelCarrito, vaciarCarrito } = useCarrito();

  const handleActualizarCantidad = (id, nuevaCantidad) => {
    actualizarCantidad(id, nuevaCantidad);
  };

  const handleEliminar = (id) => {
    eliminarDelCarrito(id);
  };

  const handleVaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      vaciarCarrito();
    }
  };

  const handleContinuarCompra = () => {
    // Aquí iría la lógica para proceder al checkout
    alert('Funcionalidad de checkout en desarrollo');
  };

  if (carrito.length === 0) {
    return (
      <div className={styles.carritoVacio}>
        <h2>Tu carrito está vacío</h2>
        <p>Parece que aún no has agregado productos a tu carrito.</p>
        <Link to="/menu" className={styles.btnSeguirComprando}>
          Ver nuestro menú
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Seguir comprando
        </button>
        <h1 className={styles.title}>Tu Carrito</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Subtotal</span>
            <span></span>
          </div>

          {carrito.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <img src={item.imagen} alt={item.nombre} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3>{item.nombre}</h3>
                  <p className={styles.itemPrecio}>${item.precio} MXN</p>
                </div>
              </div>

              <div className={styles.itemCantidad}>
                <button
                  onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                  className={styles.cantidadBtn}
                >
                  -
                </button>
                <span className={styles.cantidad}>{item.cantidad}</span>
                <button
                  onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
                  className={styles.cantidadBtn}
                >
                  +
                </button>
              </div>

              <div className={styles.itemSubtotal}>
                ${(item.precio * item.cantidad).toFixed(2)} MXN
              </div>

              <button
                onClick={() => handleEliminar(item.id)}
                className={styles.eliminarBtn}
                aria-label="Eliminar producto"
              >
                ✕
              </button>
            </div>
          ))}

          <div className={styles.acciones}>
            <button onClick={handleVaciarCarrito} className={styles.vaciarBtn}>
              Vaciar carrito
            </button>
          </div>
        </div>

        <div className={styles.resumenSection}>
          <h2>Resumen del pedido</h2>
          <div className={styles.resumenDetalles}>
            <div className={styles.resumenFila}>
              <span>Subtotal ({totalItems} productos)</span>
              <span>${totalPrecio.toFixed(2)} MXN</span>
            </div>
            <div className={styles.resumenFila}>
              <span>Envío</span>
              <span>Calculado al finalizar</span>
            </div>
            <div className={styles.divisor}></div>
            <div className={`${styles.resumenFila} ${styles.total}`}>
              <span>Total</span>
              <span>${totalPrecio.toFixed(2)} MXN</span>
            </div>
          </div>

          <button onClick={handleContinuarCompra} className={styles.btnComprar}>
            Continuar compra
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;