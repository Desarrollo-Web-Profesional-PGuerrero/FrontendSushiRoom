import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePedido } from '../../hooks/usePedido'; // Cambia la importación
import TimelinePedido from '../../components/TimelinePedido/TimelinePedido';
import styles from './EstadoPedido.module.css';

const EstadoPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pedidoActivo, loading, obtenerPedido, pasos } = usePedido();

  useEffect(() => {
    const cargarPedido = async () => {
      if (id) {
        const pedido = await obtenerPedido(parseInt(id));
        if (!pedido) {
          navigate('/');
        }
      }
    };
    
    cargarPedido();
  }, [id, obtenerPedido, navigate]);

  if (loading) {
    return (
      <div className={styles.loading}>
        Cargando información del pedido...
      </div>
    );
  }

  if (!pedidoActivo) {
    return (
      <div className={styles.error}>
        <h2>Pedido no encontrado</h2>
        <button onClick={() => navigate('/')} className={styles.button}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const fechaFormateada = new Date(pedidoActivo.fecha).toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Volver
        </button>
        <h1 className={styles.title}>Estado de tu pedido</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.infoPedido}>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Número de pedido:</span>
              <span className={styles.value}>#{pedidoActivo.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>{fechaFormateada}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Total:</span>
              <span className={styles.value}>${pedidoActivo.total.toFixed(2)} MXN</span>
            </div>
          </div>
        </div>

        <div className={styles.timelineSection}>
          <h2>Proceso de tu pedido</h2>
          <TimelinePedido 
            pasos={pasos} 
            estadoActual={pedidoActivo.estado}
          />
        </div>

        <div className={styles.resumenSection}>
          <h2>Resumen de tu pedido</h2>
          <div className={styles.itemsList}>
            {pedidoActivo.items.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCantidad}>{item.cantidad}x</span>
                  <span className={styles.itemNombre}>{item.nombre}</span>
                </div>
                <span className={styles.itemPrecio}>
                  ${(item.precio * item.cantidad).toFixed(2)} MXN
                </span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <span className={styles.totalMonto}>${pedidoActivo.total.toFixed(2)} MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoPedido;