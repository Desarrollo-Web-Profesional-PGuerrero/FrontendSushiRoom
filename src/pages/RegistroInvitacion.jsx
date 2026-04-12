import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { API_URL } from '../../services/api';
import styles from './RegistroInvitacion.module.css';

const RegistroInvitacion = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [validando, setValidando] = useState(true);
  const [invalido, setInvalido] = useState(false);
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (token) {
      validarToken();
    } else {
      setInvalido(true);
    }
  }, [token]);
  
  const validarToken = async () => {
    try {
      // ✅ Corregido: usar API_URL
      const response = await fetch(`${API_URL}/invitaciones/validar/${token}`);
      const data = await response.json();
      
      if (data.valido) {
        setEmail(data.email);
        setRol(data.rol);
      } else {
        setInvalido(true);
      }
    } catch (error) {
      console.error('Error validando token:', error);
      setInvalido(true);
    } finally {
      setValidando(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      // ✅ Corregido: usar API_URL
      const response = await fetch(`${API_URL}/invitaciones/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nombre, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        navigate('/login?registro=exitoso&rol=' + data.rol);
      } else {
        setError(data.message || 'Error al completar el registro');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };
  
  if (validando) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.loadingSpinner}></div>
          <p>Validando invitación...</p>
        </div>
      </div>
    );
  }
  
  if (invalido) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconError}>🔒</div>
          <h2>Invitación Inválida</h2>
          <p>Este enlace no es válido o ya ha sido utilizado.</p>
          <p>Posibles razones:</p>
          <ul>
            <li>El enlace ya expiró (válido por 24 horas)</li>
            <li>Ya completaste tu registro anteriormente</li>
            <li>El enlace ha sido modificado</li>
          </ul>
          <Link to="/" className={styles.homeBtn}>Volver al inicio</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <h1>🍣 The Sushi Room</h1>
        </div>
        
        <h2>Completa tu registro</h2>
        
        <div className={styles.infoBox}>
          <p>
            <strong>Rol:</strong> {rol === 'admin' ? '👑 Administrador' : '👨‍🍳 Empleado'}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
              autoFocus
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" disabled={loading} className={styles.registerBtn}>
            {loading ? 'Registrando...' : 'Completar registro'}
          </button>
        </form>
        
        <div className={styles.footer}>
          <p>Al registrarte, aceptas nuestros términos y condiciones.</p>
        </div>
      </div>
    </div>
  );
};

export default RegistroInvitacion;