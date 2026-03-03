import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import styles from './Header.module.css';

const Header = () => {
  const { totalItems } = useCarrito();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">The Sushi Room</Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/">Inicio</Link>
        <Link to="/menu">Menú</Link>
        <Link to="/experiencia">Experiencia</Link>
        <Link to="/carrito" className={styles.carrito}>
          🛒 <span className={styles.badge}>{totalItems}</span>
        </Link>
      </nav>
    </header>
  );
};

export default Header;