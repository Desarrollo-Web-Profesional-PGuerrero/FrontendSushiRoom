// src/pages/NotFound/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Animación del sushi */}
        <div className={styles.sushiAnimation}>
          <div className={styles.sushiRoll}>
            <span className={styles.sushiEmoji}>🍣</span>
            <span className={styles.sushiEmoji}>🥢</span>
            <span className={styles.sushiEmoji}>🍱</span>
          </div>
        </div>

        {/* Código de error */}
        <div className={styles.errorCode}>
          <span className={styles.codeNumber}>4</span>
          <span className={styles.codeZero}>
            <span className={styles.zeroInner}>0</span>
            <span className={styles.zeroRing}></span>
          </span>
          <span className={styles.codeNumber}>4</span>
        </div>

        {/* Mensaje principal */}
        <h1 className={styles.title}>¡Ups! Página no encontrada</h1>
        <p className={styles.message}>
          Parece que este rollo de sushi se escapó de la carta.<br />
          No te preocupes, todavía puedes disfrutar de nuestros mejores platillos.
        </p>

        {/* Enlaces de ayuda */}
        <div className={styles.suggestions}>
          <p className={styles.suggestionTitle}>¿Qué te gustaría hacer?</p>
          <div className={styles.buttonGroup}>
            <button onClick={() => navigate(-1)} className={styles.btnBack}>
              ← Volver atrás
            </button>
            <Link to="/" className={styles.btnHome}>
              🏠 Ir al inicio
            </Link>
            <Link to="/menu" className={styles.btnMenu}>
              🍣 Ver menú
            </Link>
          </div>
        </div>

        {/* Mensaje divertido */}
        <div className={styles.funMessage}>
          <span className={styles.funIcon}>🍣</span>
          <p>El chef dice: "Este platillo no está en el menú, pero tenemos muchos otros deliciosos"</p>
          <span className={styles.funIcon}>🥢</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;