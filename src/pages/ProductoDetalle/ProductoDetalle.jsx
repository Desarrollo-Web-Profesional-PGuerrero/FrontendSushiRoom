// src/pages/ProductoDetalle/ProductoDetalle.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import { getProductoById } from "../../services/api";
import styles from "./ProductoDetalle.module.css";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito, notification } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [personalizacion, setPersonalizacion] = useState({
    nivelPicante: 0,
    tipoArroz: "blanco",
    notasChef: "",
  });

  // Definir qué categorías permiten personalización
  const categoriasConPersonalizacion = ["nigiri", "roll", "sashimi", "maki"];
  
  // Definir qué productos NO deben tener personalización (bebidas, etc.)
  const productosSinPersonalizacion = [
    "coca", "coca cola", "pepsi", "sprite", "fanta", 
    "agua", "te", "té", "cerveza", "sake", "jugo",
    "bebida", "refresco"
  ];

  const debeMostrarPersonalizacion = () => {
    if (!producto) return false;
    
    const nombreLower = producto.nombre.toLowerCase();
    const categoriaLower = producto.categoria?.toLowerCase() || "";
    
    // Verificar si es una bebida o producto que no debe tener personalización
    const esBebida = productosSinPersonalizacion.some(item => 
      nombreLower.includes(item)
    );
    
    if (esBebida) return false;
    
    // Verificar si la categoría permite personalización
    return categoriasConPersonalizacion.some(cat => 
      categoriaLower.includes(cat) || nombreLower.includes(cat)
    );
  };

  useEffect(() => {
    cargarProducto();
  }, [id]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const data = await getProductoById(id);

      if (data) {
        const productoFormateado = {
          id: data.id,
          nombre: data.nombre,
          precio: parseFloat(data.precio),
          imagen: data.imagenUrl || "/images/default.jpg",
          descripcion: data.descripcion || "Delicioso platillo de nuestra cocina",
          origen: data.origen || "Japón",
          notasCata: data.notasCata || "Sabor fresco y auténtico",
          ingredientes: data.ingredientes || ["Información de ingredientes no disponible"],
          categoria: data.categoriaNombre || "Especialidad",
        };
        setProducto(productoFormateado);
        setError(null);
      } else {
        setError("Producto no encontrado");
      }
    } catch (err) {
      console.error("Error al cargar producto:", err);
      setError("No se pudo cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarCarrito = () => {
    let productoFinal = { ...producto };
    
    // Solo agregar personalización si aplica
    if (debeMostrarPersonalizacion()) {
      productoFinal = {
        ...producto,
        personalizacion: {
          nivelPicante: personalizacion.nivelPicante,
          tipoArroz: personalizacion.tipoArroz === "blanco" ? "Arroz blanco" : "Arroz integral",
          notasChef: personalizacion.notasChef,
        },
      };
    }
    
    agregarAlCarrito(productoFinal, cantidad);
  };

  const getPicanteEmoji = (nivel) => {
    if (nivel === 0) return "🌶️ Sin picante";
    if (nivel <= 2) return "🌶️ Suave";
    if (nivel <= 4) return "🌶️🌶️ Medio";
    return "🌶️🌶️🌶️ Picante";
  };

  if (loading) {
    return <div className={styles.loading}>Cargando producto...</div>;
  }

  if (error) {
    return (
      <div className={styles.notFound}>
        <h2>{error}</h2>
        <button onClick={() => navigate("/menu")} className={styles.backButtonLarge}>
          Volver al menú
        </button>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className={styles.notFound}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate("/menu")} className={styles.backButtonLarge}>
          Volver al menú
        </button>
      </div>
    );
  }

  const mostrarPersonalizacion = debeMostrarPersonalizacion();

  return (
    <div className={styles.container}>
      {/* Notificación flotante */}
      {notification?.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Volver
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.image}
            onError={(e) => {
              e.target.src = "/images/default.jpg";
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <span className={styles.categoria}>{producto.categoria}</span>
          <p className={styles.precio}>${producto.precio.toFixed(2)} MXN</p>

          {/* DESCRIPCIÓN */}
          <div className={styles.section}>
            <h3>📝 Descripción</h3>
            <p>{producto.descripcion}</p>
          </div>

          {/* ORIGEN - Solo para productos de sushi */}
          {producto.origen && mostrarPersonalizacion && (
            <div className={styles.section}>
              <h3>Origen</h3>
              <p>{producto.origen}</p>
            </div>
          )}

          {/* NOTAS DE CATA - Solo para productos de sushi */}
          {producto.notasCata && mostrarPersonalizacion && (
            <div className={styles.section}>
              <h3>Notas de cata</h3>
              <p>{producto.notasCata}</p>
            </div>
          )}

          {/* INGREDIENTES */}
          <div className={styles.section}>
            <h3>Ingredientes</h3>
            <ul className={styles.ingredientesList}>
              {Array.isArray(producto.ingredientes) ? (
                producto.ingredientes.map((ingrediente, index) => (
                  <li key={index}>{ingrediente}</li>
                ))
              ) : (
                <li>Información de ingredientes no disponible</li>
              )}
            </ul>
          </div>

          {mostrarPersonalizacion && (
            <div className={styles.personalizacionSection}>
              <h3>Personaliza tu plato</h3>

              <div className={styles.picanteControl}>
                <label>Nivel de picante</label>
                <div className={styles.sliderContainer}>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={personalizacion.nivelPicante}
                    onChange={(e) =>
                      setPersonalizacion({
                        ...personalizacion,
                        nivelPicante: parseInt(e.target.value),
                      })
                    }
                    className={styles.slider}
                  />
                  <div className={styles.picanteLabels}>
                    <span>Sin</span>
                    <span>Suave</span>
                    <span>Medio</span>
                    <span>Picante</span>
                    <span>Muy</span>
                    <span>🔥🔥🔥</span>
                  </div>
                  <div className={styles.picanteValue}>
                    {getPicanteEmoji(personalizacion.nivelPicante)}
                  </div>
                </div>
              </div>

              <div className={styles.arrozControl}>
                <label>Tipo de arroz</label>
                <div className={styles.arrozOptions}>
                  <button
                    className={`${styles.arrozBtn} ${personalizacion.tipoArroz === "blanco" ? styles.arrozBtnActive : ""}`}
                    onClick={() =>
                      setPersonalizacion({
                        ...personalizacion,
                        tipoArroz: "blanco",
                      })
                    }
                  >
                    Arroz blanco
                  </button>
                  <button
                    className={`${styles.arrozBtn} ${personalizacion.tipoArroz === "integral" ? styles.arrozBtnActive : ""}`}
                    onClick={() =>
                      setPersonalizacion({
                        ...personalizacion,
                        tipoArroz: "integral",
                      })
                    }
                  >
                    Arroz integral
                  </button>
                </div>
              </div>

              <div className={styles.notasControl}>
                <label>Notas para el chef</label>
                <textarea
                  value={personalizacion.notasChef}
                  onChange={(e) =>
                    setPersonalizacion({
                      ...personalizacion,
                      notasChef: e.target.value,
                    })
                  }
                  placeholder="Ej: Sin wasabi, extra salsa, sin gluten, más picante..."
                  rows="3"
                  className={styles.notasTextarea}
                />
              </div>
            </div>
          )}

          <div className={styles.carritoSection}>
            <div className={styles.cantidadControl}>
              <label htmlFor="cantidad">Cantidad:</label>
              <div className={styles.cantidadInput}>
                <button
                  onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                  className={styles.cantidadBtn}
                >
                  -
                </button>
                <span>{cantidad}</span>
                <button
                  onClick={() => setCantidad((prev) => prev + 1)}
                  className={styles.cantidadBtn}
                >
                  +
                </button>
              </div>
            </div>

            <button onClick={handleAgregarCarrito} className={styles.agregarBtn}>
              Agregar al carrito - ${(producto.precio * cantidad).toFixed(2)} MXN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;