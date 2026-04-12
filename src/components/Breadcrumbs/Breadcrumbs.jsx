// src/components/Breadcrumbs/Breadcrumbs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Mapeo de nombres amigables para las rutas
  const routeNames = {
    '': 'Inicio',
    'menu': 'Menú',
    'carrito': 'Carrito',
    'checkout': 'Checkout',
    'confirmacion': 'Confirmación',
    'experiencia': 'Experiencia',
    'login': 'Iniciar sesión',
    'producto': 'Producto',
    'estado-pedido': 'Estado del pedido',
    'admin': 'Administración',
    'empleado': 'Empleados'
  };

  // Si estamos en la página de inicio, no mostrar breadcrumbs
  if (pathnames.length === 0 && location.pathname === '/') {
    return null;
  }

  // Función para obtener el nombre de la ruta
  const getRouteName = (segment) => {
    // Si es un ID de producto (número)
    if (!isNaN(segment)) {
      return 'Detalle del producto';
    }
    return routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <div className={styles.breadcrumbs}>
      <div className={styles.container}>
        <Link to="/" className={styles.link}>
          <span className={styles.homeIcon}>合</span>
          Inicio
        </Link>
        
        {pathnames.map((segment, index) => {
          const isLast = index === pathnames.length - 1;
          const path = `/${pathnames.slice(0, index + 1).join('/')}`;
          const name = getRouteName(segment, index, pathnames);

          return (
            <React.Fragment key={path}>
              <span className={styles.separator}>›</span>
              {isLast ? (
                <span className={styles.current}>{name}</span>
              ) : (
                <Link to={path} className={styles.link}>
                  {name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumbs;