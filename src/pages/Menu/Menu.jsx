// src/pages/Menu/Menu.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import { getProductos } from "../../services/api";
import styles from "./Menu.module.css";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProduct, setAddingProduct] = useState(null);
  const { agregarAlCarrito, notification } = useCarrito();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();

      console.log("Datos recibidos del backend:", data);

      const productosFormateados = data.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        imagen: producto.imagenUrl || "/images/default.jpg",
        descripcion: producto.descripcion,
        origen: producto.origen,
        notasCata: producto.notasCata,
      }));

      setProductos(productosFormateados);
      setError(null);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    setAddingProduct(producto.id);
    setTimeout(() => setAddingProduct(null), 500);
    agregarAlCarrito(producto, 1);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Cargando nuestro menú...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={cargarProductos} className={styles.btnReintentar}>
          Reintentar
        </button>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className={styles.vacio}>
        <h2>No hay productos disponibles</h2>
        <p>Pronto actualizaremos nuestro menú</p>
      </div>
    );
  }

  return (
    <div className={styles.menu}>
      {notification?.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      <h1>Nuestro Menú</h1>
      <div className={styles.grid}>
        {productos.map((producto) => (
          <div key={producto.id} className={styles.card}>
            <Link to={`/producto/${producto.id}`} className={styles.cardLink}>
              <div className={styles.imageContainer}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.src = "/images/default.jpg";
                  }}
                />
              </div>
              <h3>{producto.nombre}</h3>
              <p className={styles.precio}>${producto.precio.toFixed(2)} MXN</p>
            </Link>
            <button
              className={`${styles.btnAgregar} ${addingProduct === producto.id ? styles.btnAgregando : ""}`}
              onClick={() => handleAddToCart(producto)}
            >
              {addingProduct === producto.id
                ? "✓ Agregado!"
                : "+ Agregar al carrito"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
