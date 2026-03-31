import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simular tiempo de respuesta
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        navigate('/admin/panel');
      } else {
        setError('Credenciales incorrectas. Intenta de nuevo.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logo}>
          <h1>The Sushi Room</h1>
          <p>Panel de Administración</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
              placeholder="admin123"
              required
              disabled={loading}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.info}>
          <p>Credenciales de prueba:</p>
          <p>Email: admin@sushiroom.com</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;