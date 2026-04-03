// src/pages/Menu/Menu.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import { getProductos } from "../../services/api";
import styles from "./Menu.module.css";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProduct, setAddingProduct] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendationMessage, setRecommendationMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("todos");
  const { agregarAlCarrito, notification } = useCarrito();
  const location = useLocation();

  // ... (mantén todas las funciones existentes: filtrarProductosPorPreferencias, cargarProductos, etc.)
  // Las funciones se mantienen igual, solo cambiamos los estilos

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (location.state?.recommendations && productos.length > 0) {
      const prefs = location.state.preferences;
      let message = "";

      const productosRecomendados = filtrarProductosPorPreferencias(
        productos,
        prefs
      );
      setProductosFiltrados(productosRecomendados);
      setActiveFilter("recomendados");

      if (prefs.tipo === "nigiri") {
        message = "🍣 Te recomendamos empezar con nuestros Nigiris";
      } else if (prefs.tipo === "maki") {
        message = "🌯 Prueba nuestros Makis especiales";
      } else if (prefs.tipo === "sashimi") {
        message = "🐟 Los Sashimi son una excelente elección";
      } else if (prefs.tipo === "todos") {
        message = "🎌 Explora nuestra selección variada";
      }

      if (prefs.picante === "fuerte") {
        message += " 🔥 con un toque extra picante";
      } else if (prefs.picante === "medio") {
        message += " 🌶️ con un ligero toque picante";
      }

      if (prefs.favorito === "salmón") {
        message += " 🐟 especialmente de Salmón";
      } else if (prefs.favorito === "atun") {
        message += " 🎣 especialmente de Atún";
      } else if (prefs.favorito === "camaron") {
        message += " 🦐 especialmente de Camarón";
      } else if (prefs.favorito === "vegetariano") {
        message += " 🥑 especialmente nuestra opción vegetariana";
      }

      setRecommendationMessage(message);
      setShowRecommendation(true);

      setTimeout(() => {
        setShowRecommendation(false);
      }, 5000);
    } else if (productos.length > 0) {
      setProductosFiltrados(productos);
    }
  }, [location, productos]);

  const filtrarProductosPorPreferencias = (productos, preferencias) => {
    let filtrados = [...productos];

    if (preferencias.tipo && preferencias.tipo !== "todos") {
      filtrados = filtrados.filter((producto) => {
        const nombreLower = producto.nombre.toLowerCase();
        switch (preferencias.tipo) {
          case "nigiri":
            return nombreLower.includes("nigiri");
          case "maki":
            return nombreLower.includes("maki") || nombreLower.includes("roll");
          case "sashimi":
            return nombreLower.includes("sashimi");
          default:
            return true;
        }
      });
    }

    if (preferencias.favorito && preferencias.favorito !== "todos") {
      filtrados = filtrados.filter((producto) => {
        const nombreLower = producto.nombre.toLowerCase();
        switch (preferencias.favorito) {
          case "salmón":
            return nombreLower.includes("salmón") || nombreLower.includes("salmon");
          case "atun":
            return nombreLower.includes("atún") || nombreLower.includes("atun") || nombreLower.includes("tuna");
          case "camaron":
            return nombreLower.includes("camarón") || nombreLower.includes("camaron") || nombreLower.includes("shrimp");
          case "vegetariano":
            return nombreLower.includes("vegetariano") || nombreLower.includes("veggie") || nombreLower.includes("avocado");
          default:
            return true;
        }
      });
    }

    if (preferencias.picante) {
      if (preferencias.picante === "suave") {
        filtrados = filtrados.filter((producto) => {
          return !producto.nombre.toLowerCase().includes("picante") && !producto.nombre.toLowerCase().includes("spicy");
        });
      } else if (preferencias.picante === "fuerte") {
        filtrados = filtrados.filter((producto) => {
          return producto.nombre.toLowerCase().includes("picante") || producto.nombre.toLowerCase().includes("spicy");
        });
      }
    }

    if (filtrados.length === 0) {
      return productos;
    }

    return filtrados;
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const data = await getProductos();

      const productosFormateados = data.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        imagen: producto.imagenUrl || "/images/default.jpg",
        descripcion: producto.descripcion,
        origen: producto.origen,
        notasCata: producto.notasCata,
        categoria: producto.categoria || null,
        disponible: producto.activo, // Campo para saber si está disponible
      }));

      // 🔥 SOLO mostrar productos disponibles
      const productosDisponibles = productosFormateados.filter(
        (producto) => producto.disponible === true
      );

      setProductos(productosDisponibles);
      setProductosFiltrados(productosDisponibles);
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

  const mostrarTodosLosProductos = () => {
    setProductosFiltrados(productos);
    setActiveFilter("todos");
  };

  const mostrarRecomendados = () => {
    const prefs = JSON.parse(localStorage.getItem("userPreferences") || "{}");
    if (prefs && Object.keys(prefs).length > 0) {
      const recomendados = filtrarProductosPorPreferencias(productos, prefs);
      setProductosFiltrados(recomendados);
      setActiveFilter("recomendados");
    } else {
      setRecommendationMessage("ⓘ Completa la experiencia guiada para obtener recomendaciones personalizadas");
      setShowRecommendation(true);
      setTimeout(() => {
        setShowRecommendation(false);
      }, 3000);
    }
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
      {/* Banner de recomendaciones */}
      {showRecommendation && (
        <div className={styles.recommendationBanner}>
          <span className={styles.recommendationIcon}></span>
          <span>{recommendationMessage}</span>
        </div>
      )}

      {/* Header del Menú */}
      <div className={styles.menuHeader}>
        <h1 className={styles.menuTitle}>
          {activeFilter === "recomendados" ? "Recomendados para ti" : "Nuestro Menú"}
        </h1>
        <p className={styles.menuSubtitle}>
          {activeFilter === "recomendados"
            ? "Selección especial basada en tus gustos"
            : "Descubre nuestra selección de sushi artesanal"}
        </p>
      </div>

      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <button
          className={`${styles.filterBtn} ${activeFilter === "todos" ? styles.filterActive : ""
            }`}
          onClick={mostrarTodosLosProductos}
        >
          <span className={styles.filterIcon}></span>
          <span>Todos los productos</span>
        </button>
        <button
          className={`${styles.filterBtn} ${activeFilter === "recomendados" ? styles.filterActive : ""
            }`}
          onClick={mostrarRecomendados}
        >
          <span className={styles.filterIcon}></span>
          <span>Recomendados para ti</span>
        </button>
      </div>

      {/* Notificación de carrito */}
      {notification?.show && (
        <div className={styles.notification}>
          <span className={styles.notificationIcon}>✓</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* No results */}
      {productosFiltrados.length === 0 && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🍣</div>
          <p>No encontramos productos con tus preferencias</p>
          <button onClick={mostrarTodosLosProductos} className={styles.btnVerTodos}>
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Grid de productos */}
      <div className={styles.grid}>
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className={styles.card}>
            <Link to={`/producto/${producto.id}`} className={styles.cardLink}>
              <div className={styles.imageContainer}>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  loading="lazy"  // ← Agrega esta línea
                  onError={(e) => {
                    e.target.src = "/images/default.jpg";
                  }}
                />
                <div className={styles.cardOverlay}>
                  <span>Ver detalles</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.productName}>{producto.nombre}</h3>
                <p className={styles.productPrice}>${producto.precio.toFixed(2)} MXN</p>
              </div>
            </Link>
            <button
              className={`${styles.btnAgregar} ${addingProduct === producto.id ? styles.btnAgregando : ""
                }`}
              onClick={() => handleAddToCart(producto)}
            >
              {addingProduct === producto.id ? (
                <>
                  <span>✓</span> ¡Agregado!
                </>
              ) : (
                <>
                  <span>+</span> Agregar al carrito
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;