import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular delay
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Credenciales incorrectas. Usa: admin@sushiroom.com / admin123');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>The Sushi Room</h1>
          <h2>Panel de Administración</h2>
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
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <Link to="/" className={styles.backLink}>
            ← Volver al sitio
          </Link>
        </form>

        <div className={styles.demoInfo}>
          <p>Credenciales de prueba:</p>
          <p>Email: admin@sushiroom.com</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;