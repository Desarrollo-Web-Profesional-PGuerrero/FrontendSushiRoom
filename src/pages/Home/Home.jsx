import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Efecto de parallax suave al hacer scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `scale(${1 + scrolled * 0.0005})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.home}>
      {/* Partículas de fondo (opcional, puedes quitarlas si no te gustan) */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      <div className={styles.hero}>
        {/* Fondo con imagen de sushi y overlay mejorado */}
        <div className={styles.fondoPlaceholder} ref={heroRef}>
          <div className={styles.fondoOverlay}></div>
        </div>
        
        <div className={styles.overlay}>
          {/* Elementos decorativos */}
          <div className={styles.decorativeLine}></div>
          <div className={styles.decorativeCircle}></div>
          
          {/* Contenido principal */}
          <div className={styles.contentWrapper}>
            <span className={styles.welcomeTag}>Bienvenido a</span>
            
            <h1 className={styles.title}>
              <span className={styles.titleWord}>The</span>
              <span className={styles.titleWord}>Sushi</span>
              <span className={styles.titleWord}>Room</span>
            </h1>
            
            <p className={styles.subtitle}>
              Donde cada bocado es una experiencia única
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🍣</span>
                <span>Sushi Artesanal</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✨</span>
                <span>Ingredientes Frescos</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏮</span>
                <span>Ambiente Único</span>
              </div>
            </div>
            
            <Link to="/experiencia" className={styles.btn}>
              <span className={styles.btnText}>Comenzar viaje</span>
              <span className={styles.btnIcon}>→</span>
            </Link>
            
            <div className={styles.scrollIndicator}>
              <span className={styles.scrollText}>Descubre más</span>
              <div className={styles.scrollArrow}>↓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de estadísticas (opcional) */}
      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>50+</span>
          <span className={styles.statLabel}>Variedades de Sushi</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>5</span>
          <span className={styles.statLabel}>Años de Experiencia</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>Frescura Garantizada</span>
        </div>
      </div>
    </div>
  );
};

export default Home;