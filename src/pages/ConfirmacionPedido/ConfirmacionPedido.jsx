// src/pages/ConfirmacionPedido/ConfirmacionPedido.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./ConfirmacionPedido.module.css";

const ConfirmacionPedido = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const nombreUsuario = localStorage.getItem("userName") || "cliente";

  useEffect(() => {
    // ✅ Si no hay pedido en el state, redirigir al inicio
    const pedidoData = location.state?.pedido;
    
    if (!pedidoData) {
      console.error("❌ No se recibió información del pedido");
      navigate("/");
      return;
    }
    
    setPedido(pedidoData);
    setLoading(false);
    setTimeout(() => setShowAnimation(true), 100);
  }, [location, navigate]);

  const getMensajeHora = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Procesando tu pedido...</p>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.confirmationCard} ${showAnimation ? styles.show : ""}`}>
        <div className={styles.successIcon}>
          <span>✓</span>
        </div>

        <div className={styles.headerMessage}>
          <h1 className={styles.title}>
            ¡{getMensajeHora()}, {nombreUsuario}!
          </h1>
          <p className={styles.subtitle}>Tu pedido ha sido confirmado</p>
        </div>

        <div className={styles.pedidoDetails}>
          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>🍣</div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Número de pedido</span>
              <span className={styles.detailValue}>#{pedido.numeroPedido || pedido.id}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>⏱️</div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Tiempo estimado</span>
              <span className={styles.detailValue}>{pedido.tiempoEstimado}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>💰</div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Total</span>
              <span className={styles.detailValue}>${pedido.total?.toFixed(2) || 0} MXN</span>
            </div>
          </div>
        </div>

        <div className={styles.resumenSection}>
          <h3>Resumen de tu pedido</h3>
          <div className={styles.resumenLista}>
            {pedido.productos?.map((item, index) => (
              <div key={index} className={styles.resumenItem}>
                <span className={styles.resumenCantidad}>{item.cantidad}x</span>
                <span className={styles.resumenNombre}>{item.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/menu" className={styles.btnSecondary}>
            ← Seguir explorando
          </Link>
          <Link
            to={`/estado-pedido/${pedido.numeroPedido || pedido.id}`}
            className={styles.btnPrimary}
          >
            Ver estado del pedido →
          </Link>
        </div>

        <div className={styles.footerMessage}>
          <p>Gracias por tu preferencia. ¡Disfruta tu experiencia!</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionPedido;