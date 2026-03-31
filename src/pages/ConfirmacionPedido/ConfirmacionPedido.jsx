// src/pages/ConfirmacionPedido/ConfirmacionPedido.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './ConfirmacionPedido.module.css';

const ConfirmacionPedido = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Obtener nombre del usuario (puedes cambiarlo o traerlo de localStorage/contexto)
  const nombreUsuario = localStorage.getItem('userName') || 'viajero gastronómico';

  // Datos del chef (placeholder con imagen)
  const chefInfo = {
    nombre: 'Chef Tanaka',
    experiencia: '15 años',
    especialidad: 'Sushi tradicional',
    imagen: 'https://img.freepik.com/foto-gratis/retrato-chef-profesional-cocina_23-2150703107.jpg',
    frase: 'El sushi es arte que se disfruta con todos los sentidos'
  };

  useEffect(() => {
    // Simular carga de datos del pedido
    setTimeout(() => {
      // Si viene información del pedido por location.state, usarla, si no usar mock
      const pedidoData = location.state?.pedido || {
        id: 'SUSH-' + Math.floor(Math.random() * 10000),
        tiempoEstimado: '25-35 minutos',
        total: 576.80,
        productos: [
          { nombre: 'Salmón Nigiri', cantidad: 2 },
          { nombre: 'Roll Spicy Tuna', cantidad: 1 },
          { nombre: 'Té Verde', cantidad: 1 }
        ]
      };
      setPedido(pedidoData);
      setLoading(false);
      setTimeout(() => setShowAnimation(true), 100);
    }, 1000);
  }, [location]);

  // Frases inspiradoras para storytelling
  const frasesInspiradoras = [
    'La paciencia es el ingrediente secreto de los grandes sabores',
    'Cada rollo está hecho con dedicación y amor',
    'Tu comida viaja desde nuestra cocina hasta tu mesa con el mayor cuidado',
    'El sushi es arte, y cada pieza es única como este momento',
    'Gracias por confiar en nosotros para esta experiencia culinaria'
  ];

  const fraseAleatoria = frasesInspiradoras[Math.floor(Math.random() * frasesInspiradoras.length)];

  const getMensajeHora = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'buenos días';
    if (hora < 19) return 'buenas tardes';
    return 'buenas noches';
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.rollingSushi}>
            <div className={styles.sushiPiece}></div>
            <div className={styles.sushiPiece}></div>
            <div className={styles.sushiPiece}></div>
          </div>
          <p className={styles.loadingText}>Preparando tu experiencia...</p>
          <p className={styles.loadingSubtext}>Estamos dando los últimos toques a tu pedido</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgDecoration}>
        <div className={styles.wave}></div>
        <div className={styles.wave2}></div>
      </div>

      <div className={`${styles.confirmationCard} ${showAnimation ? styles.show : ''}`}>
        {/* Sello de éxito */}
        <div className={styles.seal}>
          <div className={styles.sealInner}>
            <span className={styles.sealIcon}>✓</span>
          </div>
        </div>

        {/* Mensaje personalizado */}
        <div className={styles.headerMessage}>
          <h1 className={styles.title}>
            <span className={styles.greeting}>✨ {getMensajeHora()}, {nombreUsuario}!</span>
            <span className={styles.storyTitle}>Tu viaje culinario ha comenzado</span>
          </h1>
          <div className={styles.story}>
            <p>
              En este momento, nuestros <strong>maestros sushi</strong> están 
              seleccionando los mejores ingredientes para crear tu pedido.
              Cada pieza es elaborada con la misma dedicación y tradición 
              que nos ha acompañado por generaciones.
            </p>
            <p className={styles.inspiration}>
              "{fraseAleatoria}"
            </p>
          </div>
        </div>

        {/* Detalles del pedido */}
        <div className={styles.pedidoDetails}>
          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>🍣</div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Número de pedido</span>
              <span className={styles.detailValue}>{pedido.id}</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>⏱️</div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Tiempo estimado</span>
              <span className={styles.detailValue}>{pedido.tiempoEstimado}</span>
              <span className={styles.detailSub}>Preparación + entrega</span>
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailIcon}>👨‍🍳</div>
            <div className={styles.detailInfo}>
              <span className={styles.detailLabel}>Chef asignado</span>
              <span className={styles.detailValue}>{chefInfo.nombre}</span>
              <span className={styles.detailSub}>{chefInfo.experiencia} de experiencia</span>
            </div>
          </div>
        </div>

        {/* Foto del chef con storytelling */}
        <div className={styles.chefSection}>
          <div className={styles.chefImage}>
            <img 
              src={chefInfo.imagen} 
              alt={chefInfo.nombre}
              className={styles.chefPhoto}
              onError={(e) => {
                e.target.src = 'https://img.freepik.com/foto-gratis/retrato-chef-profesional-cocina_23-2150703107.jpg';
              }}
            />
          </div>
          <div className={styles.chefMessage}>
            <p>
              <span className={styles.chefQuote}>"</span>
              {chefInfo.frase}
              <span className={styles.chefQuote}>"</span>
            </p>
            <div className={styles.chefSignature}>
              — {chefInfo.nombre}, {chefInfo.especialidad}
            </div>
          </div>
        </div>

        {/* Resumen rápido */}
        <div className={styles.resumenRapido}>
          <h3>🍱 Tu pedido</h3>
          <div className={styles.resumenLista}>
            {pedido.productos?.map((item, index) => (
              <div key={index} className={styles.resumenItem}>
                <span>{item.cantidad}x</span>
                <span>{item.nombre}</span>
              </div>
            ))}
          </div>
          <div className={styles.resumenTotal}>
            <span>Total</span>
            <strong>${pedido.total.toFixed(2)} MXN</strong>
          </div>
        </div>

        {/* Próximos pasos con storytelling */}
        <div className={styles.nextSteps}>
          <h3>✨ Lo que sigue</h3>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>👨‍🍳</div>
              <div className={styles.stepText}>
                <strong>Preparación</strong>
                <p>Nuestro chef comenzará a preparar tu pedido</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>🚚</div>
              <div className={styles.stepText}>
                <strong>En camino</strong>
                <p>Tu sushi viajará hasta tu puerta</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>🍱</div>
              <div className={styles.stepText}>
                <strong>Disfruta</strong>
                <p>La experiencia que esperabas está por llegar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className={styles.actions}>
          <Link to="/menu" className={styles.btnSecondary}>
            ← Seguir explorando
          </Link>
          <Link to={`/estado-pedido/${pedido.id}`} className={styles.btnPrimary}>
            Ver estado del pedido →
          </Link>
        </div>

        {/* Mensaje final */}
        <div className={styles.footerMessage}>
          <p>
            💫 Gracias por ser parte de nuestra historia. 
            En The Sushi Room, cada pedido es una experiencia única.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionPedido;