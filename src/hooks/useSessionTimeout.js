// src/hooks/useSessionTimeout.js
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionTimeout = (timeoutMinutes) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    console.log('🔍 [useSessionTimeout] Ejecutando con timeoutMinutes:', timeoutMinutes);
    
    if (timeoutMinutes === null || timeoutMinutes === undefined) {
      console.log('⏭️ [useSessionTimeout] Timeout desactivado');
      return;
    }
    
    // ✅ 10 minutos
    const timeoutMs = 10 * 60 * 1000;
    console.log(`⏱️ [useSessionTimeout] Timeout configurado a ${timeoutMs/1000} segundos`);

    const resetTimer = () => {
      console.log('🔄 [useSessionTimeout] resetTimer llamado');
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      const token = localStorage.getItem('token');
      console.log('🔑 [useSessionTimeout] Token existe?', !!token, token);
      
      if (token) {
        timerRef.current = setTimeout(() => {
          console.log('💥 [useSessionTimeout] TIMEOUT ALCANZADO - Cerrando sesión');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userRol');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          
          alert('Tu sesión ha expirado por inactividad.');
          
          if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/empleado')) {
            navigate('/login');
          } else {
            navigate('/');
          }
        }, timeoutMs);
        console.log('✅ [useSessionTimeout] Timer iniciado');
      } else {
        console.log('❌ [useSessionTimeout] No hay token, no se inicia timer');
      }
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click', 'focus'];
    
    const handleActivity = () => {
      console.log('🖱️ [useSessionTimeout] Actividad detectada');
      resetTimer();
    };
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    resetTimer();
    
    return () => {
      console.log('🧹 [useSessionTimeout] Limpiando');
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [navigate, timeoutMinutes]);

  return null;
};

export default useSessionTimeout;