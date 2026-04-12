// src/pages/NotFound/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {/* 404 creativo */}
        <div className={styles.errorCode}>
          <span className={styles.codeNumber}>4</span>

          {/* SUSHI COMO 0 */}
          <img
            src="https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-how-to-choose-fresh-ingredients-for-sushi-png-image_13425238.png"
            alt="Sushi roll"
            className={styles.sushiZero}
          />

          <span className={styles.codeNumber}>4</span>
        </div>

        {/* Título */}
        <h1 className={styles.title}>
          ¡Ups! Este rollo no existe
        </h1>

        {/* Mensaje */}
        <p className={styles.message}>
          Parece que este sushi se perdió en la cocina…<br />
          pero tenemos muchos más esperándote
        </p>

        {/* Botones */}
        <div className={styles.buttons}>
          <button onClick={() => navigate(-1)} className={styles.btnBack}>
            ← Regresar
          </button>

          <Link to="/" className={styles.btnPrimary}>
            Ir al inicio
          </Link>

          <Link to="/menu" className={styles.btnSecondary}>
            Ver menú
          </Link>
        </div>

        {/* Decoración flotante */}
        <div className={styles.floating}>
          <span>🍣</span>
          <span>🥢</span>
          <span>🍤</span>
          <span>🍱</span>
        </div>

      </div>
    </div>
  );
};

export default NotFound;