import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sitemap.module.css';

const Sitemap = () => {
  const routes = [
    { path: '/', name: 'Inicio' },
    { path: '/menu', name: 'Menú' },
    { path: '/experiencia', name: 'Experiencia' },
    { path: '/carrito', name: 'Carrito' },
    { path: '/checkout', name: 'Checkout' },
    { path: '/login', name: 'Iniciar sesión' },
    { path: '/admin/login', name: 'Admin login' },
    { path: '/sitemap', name: 'Mapa del sitio' },
  ];

  return (
    <div className={styles.sitemap}>
      <h1>🗺️ Mapa del sitio</h1>
      <ul>
        {routes.map(route => (
          <li key={route.path}>
            <Link to={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sitemap; 