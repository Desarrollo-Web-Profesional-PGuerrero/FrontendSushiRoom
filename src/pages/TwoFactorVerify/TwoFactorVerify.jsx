// src/pages/TwoFactorVerify/TwoFactorVerify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../services/api';
import styles from './TwoFactorVerify.module.css';

const TwoFactorVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Obtener email de la navegación
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Ingresa el código de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ Corregido: usar API_URL
      const response = await fetch(`${API_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', 'logged_in');
        localStorage.setItem('userRol', data.rol);
        localStorage.setItem('userName', data.nombre);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('user', JSON.stringify({
          nombre: data.nombre,
          email: data.email,
          rol: data.rol
        }));

        if (data.rol === 'admin') {
          navigate('/admin/panel');
        } else if (data.rol === 'empleado') {
          navigate('/empleado/panel');
        } else {
          navigate('/');
        }
      } else {
        setError(data.message || 'Código inválido');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setCountdown(60);
    try {
      // ✅ Corregido: usar API_URL
      const response = await fetch(`${API_URL}/auth/resend-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message || 'Error al reenviar el código');
      }
    } catch (err) {
      setError('Error al reenviar el código');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>🔐</div>
        <h1>Verificación de dos pasos</h1>
        <p className={styles.description}>
          Hemos enviado un código de verificación a tu correo electrónico.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Código de verificación</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength="6"
              autoFocus
              className={styles.codeInput}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Verificando...' : 'Verificar código'}
          </button>

          <div className={styles.resendContainer}>
            {countdown > 0 ? (
              <p className={styles.countdown}>Reenviar código en {countdown} segundos</p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className={styles.resendBtn}
              >
                Reenviar código
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className={styles.backLink}
          >
            ← Volver al inicio de sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorVerify;