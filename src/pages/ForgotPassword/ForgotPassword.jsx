// src/pages/ForgotPassword/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../services/api';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // ✅ Corregido: usar API_URL
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Error al enviar el correo');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🔐</div>
        <h1>¿Olvidaste tu contraseña?</h1>
        <p className={styles.description}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {success ? (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successMessage}>
              ¡Correo enviado! Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>
            <button onClick={() => navigate('/login')} className={styles.backBtn}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sushiroom.com"
                required
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>

            <Link to="/login" className={styles.backLink}>
              ← Volver al inicio de sesión
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;