// src/pages/ConfirmacionPedido/ConfirmacionPedido.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../services/api";
import styles from "./ConfirmacionPedido.module.css";

const ConfirmacionPedido = () => {
  const { numeroPedido } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const nombreUsuario = localStorage.getItem("userName") || "cliente";

  useEffect(() => {
    const cargarPedido = async () => {
      if (!numeroPedido) {
        console.error("❌ No hay número de pedido en la URL");
        setError(true);
        setLoading(false);
        return;
      }

      console.log("🔍 Buscando pedido:", numeroPedido);
      
      try {
        const response = await fetch(`${API_URL}/pedidos/buscar/${numeroPedido}`);
        const data = await response.json();
        
        console.log("📥 Respuesta del backend:", data);
        
        if (data.success && data.pedido) {
          const pedidoData = {
            numeroPedido: data.pedido.numeroPedido,
            id: data.pedido.id,
            tiempoEstimado: "25-35 minutos",
            total: data.pedido.total,
            productos: data.detalles?.map(d => ({
              nombre: d.nombreProducto,
              cantidad: d.cantidad
            })) || []
          };
          setPedido(pedidoData);
          setError(false);
        } else {
          console.error("❌ Pedido no encontrado");
          setError(true);
        }
      } catch (err) {
        console.error("❌ Error al cargar pedido:", err);
        setError(true);
      } finally {
        setLoading(false);
        setTimeout(() => setShowAnimation(true), 100);
      }
    };

    cargarPedido();
  }, [numeroPedido]);

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
          <p className={styles.loadingText}>Cargando tu pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className={styles.container}>
        <div className={styles.confirmationCard}>
          <h2>¡Ups! Algo salió mal</h2>
          <p>No pudimos encontrar tu pedido.</p>
          <Link to="/menu" className={styles.btnPrimary}>
            Volver al menú
          </Link>
        </div>
      </div>
    );
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
              <span className={styles.detailValue}>#{pedido.numeroPedido}</span>
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
          <Link to={`/estado-pedido/${pedido.numeroPedido}`} className={styles.btnPrimary}>
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