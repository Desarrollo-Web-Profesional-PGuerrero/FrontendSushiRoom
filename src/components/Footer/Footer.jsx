// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2026 The Sushi Room - Tu oasis de calma culinaria</p>
      <Link to="/login" className={styles.adminLink}>
        <span className="material-icons">admin_panel_settings</span> Acceso administrativo
      </Link>
    </footer>
  );
};

export default Footer;