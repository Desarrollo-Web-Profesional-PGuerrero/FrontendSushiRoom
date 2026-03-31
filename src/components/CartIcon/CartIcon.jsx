// src/components/CartIcon/CartIcon.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import styles from "./CartIcon.module.css";

const CartIcon = () => {
  // Usamos useCarrito en lugar de useCart
  const { totalItems, notification } = useCarrito();

  // Animación cuando se agrega un producto
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (notification?.show) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {/* Notificación flotante */}
      {notification?.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      <Link to="/carrito" className={styles.cartIcon}>
        <div
          className={`${styles.iconContainer} ${animate ? styles.bump : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.icon}
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
        </div>
      </Link>
    </>
  );
};

export default CartIcon;
