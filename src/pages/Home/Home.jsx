import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        {/* Por ahora un fondo de color, después pondremos video */}
        <div className={styles.fondoPlaceholder}></div>
        
        <div className={styles.overlay}>
          <h1>The Sushi Room</h1>
          <p className={styles.subtitle}>Tu oasis de calma culinaria</p>
          <Link to="/experiencia" className={styles.btn}>
            Comenzar viaje
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;