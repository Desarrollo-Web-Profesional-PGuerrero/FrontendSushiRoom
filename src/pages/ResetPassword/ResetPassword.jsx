// src/pages/ResetPassword/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import { API_URL } from '../../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token inválido o expirado');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ CORREGIDO: usar backticks ` ` en lugar de comillas simples ' '
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Error al restablecer la contraseña');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && !success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.icon}>⚠️</div>
          <h1>Enlace inválido</h1>
          <p className={styles.description}>
            El enlace de recuperación es inválido o ha expirado.
          </p>
          <Link to="/forgot-password" className={styles.backLink}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {success ? (
          <>
            <div className={styles.successIcon}>✓</div>
            <h1>¡Contraseña actualizada!</h1>
            <p className={styles.description}>
              Tu contraseña ha sido restablecida exitosamente.
              Serás redirigido al inicio de sesión...
            </p>
            <Link to="/login" className={styles.backLink}>
              Ir al inicio de sesión
            </Link>
          </>
        ) : (
          <>
            <div className={styles.icon}>🔐</div>
            <h1>Nueva contraseña</h1>
            <p className={styles.description}>
              Ingresa tu nueva contraseña a continuación.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.formGroup}>
                <label>Nueva contraseña</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Confirmar contraseña</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </button>

              <Link to="/login" className={styles.backLink}>
                ← Volver al inicio de sesión
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;