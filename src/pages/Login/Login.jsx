import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import styles from "./Login.module.css";

// ✅ Importar la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Usar API_URL
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresTwoFactor) {
          navigate('/verify-2fa', { state: { email: data.email } });
        } else {
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
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setRecoveryMessage('');

    try {
      // ✅ Usar API_URL
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRecoveryMessage('✅ Se ha enviado un enlace de recuperación a tu correo electrónico');
        setTimeout(() => {
          setShowRecovery(false);
          setRecoveryEmail('');
          setRecoveryMessage('');
        }, 3000);
      } else {
        setRecoveryMessage('❌ ' + (data.message || 'No existe una cuenta con ese email'));
      }
    } catch (error) {
      console.error('Error en recuperación:', error);
      setRecoveryMessage('❌ Error al conectar con el servidor. Intenta más tarde.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const closeRecoveryModal = () => {
    setShowRecovery(false);
    setRecoveryEmail('');
    setRecoveryMessage('');
  };

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h1>The Sushi Room</h1>
            <h2>Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sushiroom.com"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.loginBtn}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>

            <div className={styles.linksContainer}>
              <button 
                type="button" 
                onClick={() => setShowRecovery(true)} 
                className={styles.recoverLink}
              >
                ¿Olvidaste tu contraseña?
              </button>
              
              <Link to="/" className={styles.backLink}>
                ← Volver al sitio
              </Link>
            </div>
          </form>
        </div>
      </div>

      {showRecovery && (
        <div className={styles.modalOverlay} onClick={closeRecoveryModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Recuperar Contraseña</h3>
              <button className={styles.modalClose} onClick={closeRecoveryModal}>✕</button>
            </div>
            
            <form onSubmit={handleRecovery}>
              <div className={styles.formGroup}>
                <label htmlFor="recoveryEmail">Correo electrónico</label>
                <input
                  type="email"
                  id="recoveryEmail"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={recoveryLoading}
                  autoComplete="off"
                />
              </div>
              
              {recoveryMessage && (
                <div className={`${styles.recoveryMessage} ${recoveryMessage.includes('✅') ? styles.successMessage : styles.errorMessage}`}>
                  {recoveryMessage}
                </div>
              )}
              
              <div className={styles.modalActions}>
                <button 
                  type="submit" 
                  disabled={recoveryLoading} 
                  className={styles.recoveryBtn}
                >
                  {recoveryLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
                <button 
                  type="button" 
                  onClick={closeRecoveryModal} 
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
              </div>
            </form>
            
            <div className={styles.modalFooter}>
              <p>Te enviaremos un enlace para restablecer tu contraseña</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;