// src/pages/Carrito/Carrito.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import styles from "./Carrito.module.css";

const Carrito = () => {
  const navigate = useNavigate();
  const {
    carrito,
    totalPrecio,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    notification,
  } = useCarrito();
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleProcederPago = () => {
    navigate("/checkout");
  };

  const handleEliminarClick = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmarEliminar = () => {
    if (itemToDelete) {
      eliminarDelCarrito(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const getPicanteTexto = (nivel) => {
    if (!nivel && nivel !== 0) return "";
    if (nivel === 0) return "Sin picante";
    if (nivel === 1) return "🌶️ Suave";
    if (nivel === 2) return "🌶️🌶️ Medio bajo";
    if (nivel === 3) return "🌶️🌶️🌶️ Medio";
    if (nivel === 4) return "🌶️🌶️🌶️🌶️ Picante";
    return "🌶️🌶️🌶️🌶️🌶️ Muy picante";
  };

  if (carrito.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.carritoVacio}>
          <h2>Tu carrito está vacío</h2>
          <p>¿Listo para pedir? Explora nuestro menú</p>
          <Link to="/menu" className={styles.btnMenu}>
            Ver menú
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Notificación flotante */}
      {notification?.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      {/* Modal de confirmación */}
      {itemToDelete && (
        <div
          className={styles.modalOverlay}
          onClick={() => setItemToDelete(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗑️</div>
            <h3>¿Eliminar producto?</h3>
            <p>
              ¿Estás seguro de que quieres eliminar{" "}
              <strong>{itemToDelete.nombre}</strong> de tu carrito?
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => setItemToDelete(null)}
                className={styles.modalBtnCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminar}
                className={styles.modalBtnConfirmar}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <h1>Mi Carrito</h1>
        {carrito.length > 0 && (
          <button onClick={vaciarCarrito} className={styles.btnVaciar}>
            Vaciar carrito
          </button>
        )}
      </div>

      {/* Lista de productos */}
      <div className={styles.lista}>
        {carrito.map((item) => (
          <div key={item.id} className={styles.item}>
            <img
              src={item.imagen || "/images/default.jpg"}
              alt={item.nombre}
              className={styles.imagen}
              onError={(e) => {
                e.target.src = "/images/default.jpg";
              }}
            />

            <div className={styles.info}>
              <h3>{item.nombre}</h3>
              <p className={styles.precioUnitario}>${item.precio} MXN c/u</p>

              {/* Mostrar personalizaciones si existen */}
              {item.personalizacion && (
                <div className={styles.personalizacionInfo}>
                  {item.personalizacion.nivelPicante !== undefined &&
                    (item.personalizacion.nivelPicante > 0 ||
                      item.personalizacion.nivelPicante === 0) && (
                      <span className={styles.badgePicante}>
                        {getPicanteTexto(item.personalizacion.nivelPicante)}
                      </span>
                    )}
                  {item.personalizacion.tipoArroz &&
                    item.personalizacion.tipoArroz !== "Arroz blanco" && (
                      <span className={styles.badgeArroz}>
                        🍚 {item.personalizacion.tipoArroz}
                      </span>
                    )}
                  {item.personalizacion.notasChef && (
                    <span className={styles.badgeNota}>
                      📝 Nota: {item.personalizacion.notasChef.substring(0, 40)}
                      {item.personalizacion.notasChef.length > 40 ? "..." : ""}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.cantidad}>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                className={styles.btnCantidad}
                disabled={item.cantidad <= 1}
              >
                -
              </button>
              <span>{item.cantidad}</span>
              <button
                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                className={styles.btnCantidad}
              >
                +
              </button>
            </div>

            <p className={styles.subtotal}>
              ${(item.precio * item.cantidad).toFixed(2)} MXN
            </p>

            <button
              onClick={() => handleEliminarClick(item)}
              className={styles.btnEliminar}
              title="Eliminar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Total y botón */}
      <div className={styles.footer}>
        <div className={styles.total}>
          <span>Total a pagar:</span>
          <span className={styles.totalMonto}>
            ${totalPrecio.toFixed(2)} MXN
          </span>
        </div>

        <button onClick={handleProcederPago} className={styles.btnPago}>
          🛒 Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Carrito;
