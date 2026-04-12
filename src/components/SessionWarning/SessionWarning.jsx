// src/components/SessionWarning/SessionWarning.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './SessionWarning.module.css';

const SessionWarning = ({ timeoutMinutes = 10, onExtend }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const warningTime = (timeoutMinutes * 60 * 1000) - (30 * 1000); // 10 minutos - 30 segundos = 9.5 minutos
  
  const mainTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const startTimers = () => {
    // Limpiar timers existentes
    if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    
    setShowWarning(false);
    setSecondsLeft(30);
    
    const token = localStorage.getItem('token');
    if (!token) return;

    // Timer para mostrar la advertencia (a los 9.5 minutos)
    mainTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      
      // Contador regresivo de 30 segundos
      warningTimerRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(warningTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    }, warningTime);
  };

  useEffect(() => {
    startTimers();
    
    // Escuchar evento personalizado para reiniciar
    const handleReset = () => {
      startTimers();
    };
    
    window.addEventListener('reset-session-warning', handleReset);
    
    return () => {
      window.removeEventListener('reset-session-warning', handleReset);
      if (mainTimerRef.current) clearTimeout(mainTimerRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [warningTime]);

  const handleExtend = () => {
    // Disparar evento para reiniciar todo
    window.dispatchEvent(new Event('reset-session-warning'));
    window.dispatchEvent(new Event('mousemove'));
    if (onExtend) onExtend();
  };

  if (!showWarning) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>⏰</div>
        <h3>Tu sesión está por expirar</h3>
        <p>
          Por tu seguridad, la sesión expirará en <strong>{secondsLeft} segundos</strong> por inactividad.
        </p>
        <button onClick={handleExtend} className={styles.btnExtend}>
          Continuar sesión
        </button>
      </div>
    </div>
  );
};

export default SessionWarning;