import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Llamar al endpoint de login directamente para manejar 2FA
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresTwoFactor) {
          // Redirigir a verificación 2FA
          navigate('/verify-2fa', { state: { email: data.email } });
        } else {
          // Login normal (sin 2FA) - por si acaso
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

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1>Administración</h1>
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
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          <Link to="/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </Link>

          <Link to="/" className={styles.backLink}>
            ← Volver al sitio
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;