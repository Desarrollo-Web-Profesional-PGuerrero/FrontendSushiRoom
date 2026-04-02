import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.rol === 'admin') {
          navigate('/admin/panel');
        } else if (user.rol === 'empleado') {
          navigate('/empleado/panel');
        } else {
          navigate('/');
        }
      } else {
        setError('Credenciales incorrectas');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
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
            />
          </div>

          <button type="submit" disabled={loading} className={styles.loginBtn}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <Link to="/" className={styles.backLink}>
            ← Volver al sitio
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;