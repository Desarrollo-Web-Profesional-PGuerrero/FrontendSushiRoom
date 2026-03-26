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
  const [activeFilter, setActiveFilter] = useState("todos"); // 'todos', 'recomendados'
  const { agregarAlCarrito, notification } = useCarrito();
  const location = useLocation();

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    // Verificar si viene de experiencia guiada
    if (location.state?.recommendations && productos.length > 0) {
      const prefs = location.state.preferences;
      let message = "";

      // Filtrar productos según preferencias
      const productosRecomendados = filtrarProductosPorPreferencias(
        productos,
        prefs
      );
      setProductosFiltrados(productosRecomendados);
      setActiveFilter("recomendados");

      // Generar mensaje de recomendación
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
      // Si no hay recomendaciones, mostrar todos los productos
      setProductosFiltrados(productos);
    }
  }, [location, productos]);

  // Función para filtrar productos según preferencias
  const filtrarProductosPorPreferencias = (productos, preferencias) => {
    let filtrados = [...productos];

    // Filtrar por tipo de sushi (basado en el nombre o categoría)
    if (preferencias.tipo && preferencias.tipo !== "todos") {
      filtrados = filtrados.filter((producto) => {
        const nombreLower = producto.nombre.toLowerCase();
        switch (preferencias.tipo) {
          case "nigiri":
            return nombreLower.includes("nigiri");
          case "maki":
            return (
              nombreLower.includes("maki") || nombreLower.includes("roll")
            );
          case "sashimi":
            return nombreLower.includes("sashimi");
          default:
            return true;
        }
      });
    }

    // Filtrar por proteína favorita
    if (preferencias.favorito && preferencias.favorito !== "todos") {
      filtrados = filtrados.filter((producto) => {
        const nombreLower = producto.nombre.toLowerCase();
        switch (preferencias.favorito) {
          case "salmón":
            return (
              nombreLower.includes("salmón") || nombreLower.includes("salmon")
            );
          case "atun":
            return (
              nombreLower.includes("atún") ||
              nombreLower.includes("atun") ||
              nombreLower.includes("tuna")
            );
          case "camaron":
            return (
              nombreLower.includes("camarón") ||
              nombreLower.includes("camaron") ||
              nombreLower.includes("shrimp")
            );
          case "vegetariano":
            return (
              nombreLower.includes("vegetariano") ||
              nombreLower.includes("veggie") ||
              nombreLower.includes("avocado") ||
              nombreLower.includes("aguacate") ||
              nombreLower.includes("pepino") ||
              nombreLower.includes("cucumber")
            );
          default:
            return true;
        }
      });
    }

    // Filtrar por nivel de picante
    if (preferencias.picante) {
      if (preferencias.picante === "suave") {
        filtrados = filtrados.filter((producto) => {
          return (
            !producto.nombre.toLowerCase().includes("picante") &&
            !producto.nombre.toLowerCase().includes("spicy")
          );
        });
      } else if (preferencias.picante === "fuerte") {
        filtrados = filtrados.filter((producto) => {
          return (
            producto.nombre.toLowerCase().includes("picante") ||
            producto.nombre.toLowerCase().includes("spicy")
          );
        });
      }
    }

    // Si después de filtrar no hay productos, mostrar todos
    if (filtrados.length === 0) {
      return productos;
    }

    return filtrados;
  };

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
        categoria: producto.categoria || null,
      }));

      setProductos(productosFormateados);
      setProductosFiltrados(productosFormateados);
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
      // Si no hay preferencias guardadas, mostrar un mensaje
      setRecommendationMessage("🎯 Completa la experiencia guiada para obtener recomendaciones personalizadas");
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
      {/* Banner de recomendaciones de experiencia guiada */}
      {showRecommendation && (
        <div className={styles.recommendationBanner}>
          🎯 {recommendationMessage}
        </div>
      )}

      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <button
          className={`${styles.filterBtn} ${
            activeFilter === "todos" ? styles.filterActive : ""
          }`}
          onClick={mostrarTodosLosProductos}
        >
          📋 Todos los productos
        </button>
        <button
          className={`${styles.filterBtn} ${
            activeFilter === "recomendados" ? styles.filterActive : ""
          }`}
          onClick={mostrarRecomendados}
        >
          🎯 Recomendados para ti
        </button>
      </div>

      {/* Notificación de carrito */}
      {notification?.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      <h1>
        {activeFilter === "recomendados" ? "Recomendados para ti" : "Nuestro Menú"}
      </h1>

      {productosFiltrados.length === 0 && (
        <div className={styles.noResults}>
          <p>No encontramos productos con tus preferencias</p>
          <button onClick={mostrarTodosLosProductos} className={styles.btnVerTodos}>
            Ver todos los productos
          </button>
        </div>
      )}

      <div className={styles.grid}>
        {productosFiltrados.map((producto) => (
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
              className={`${styles.btnAgregar} ${
                addingProduct === producto.id ? styles.btnAgregando : ""
              }`}
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