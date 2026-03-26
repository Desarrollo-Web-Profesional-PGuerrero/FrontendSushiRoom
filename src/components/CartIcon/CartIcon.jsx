// src/components/CartIcon/CartIcon.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CarritoContext'; // Cambiar importación
import styles from './CartIcon.module.css';

const CartIcon = () => {
  const { getCartCount, notification } = useCart();
  const itemCount = getCartCount();

  return (
    <Link to="/carrito" className={styles.cartIcon}>
      <span className={styles.icon}>🛒</span>
      {itemCount > 0 && (
        <span className={`${styles.badge} ${notification.show ? styles.badgePulse : ''}`}>
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;