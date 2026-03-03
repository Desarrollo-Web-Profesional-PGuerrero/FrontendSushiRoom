import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Menu.module.css';

// Datos temporales hasta que tengamos backend
const productosMock = [
  { id: 1, nombre: 'Salmón Nigiri', precio: 12000, imagen: '/src/assets/images/salmon.jpg' },
  { id: 2, nombre: 'Atún Nigiri', precio: 14000, imagen: '/src/assets/images/tuna.jpg' },
  { id: 3, nombre: 'Roll California', precio: 18000, imagen: '/src/assets/images/california.png' },
  { id: 4, nombre: 'Roll Spicy Tuna', precio: 20000, imagen: '/src/assets/images/spicy.jpg' },
  { id: 5, nombre: 'Sashimi Salmón', precio: 22000, imagen: '/src/assets/images/sashimi.png' },
  { id: 6, nombre: 'Ebi Roll', precio: 19000, imagen: '/src/assets/images/ebi.jpg' },
];

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setProductos(productosMock);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className={styles.loading}>Cargando menú...</div>;
  }

  return (
    <div className={styles.menu}>
      <h1>Nuestro Menú</h1>
      <div className={styles.grid}>
        {productos.map(producto => (
          <Link to={`/producto/${producto.id}`} key={producto.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <img src={producto.imagen} alt={producto.nombre} />
            </div>
            <h3>{producto.nombre}</h3>
            <p className={styles.precio}>${producto.precio.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;