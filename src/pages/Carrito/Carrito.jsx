// src/pages/Carrito/Carrito.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import styles from "./Carrito.module.css";

const Carrito = () => {
  const navigate = useNavigate();
  const {
    carrito,
    totalPrecio,
    actualizarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    notification,
  } = useCarrito();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [propina, setPropina] = useState(() => {
    const savedPropina = localStorage.getItem("propina");
    return savedPropina ? JSON.parse(savedPropina) : 0;
  });
  const [propinaPersonalizada, setPropinaPersonalizada] = useState(() => {
    const savedPropinaPersonalizada = localStorage.getItem("propinaPersonalizada");
    return savedPropinaPersonalizada || "";
  });

  const handleProcederPago = () => {
    navigate("/checkout");
  };

  const handleEliminarClick = (item) => {
    setItemToDelete(item);
  };

  const handleConfirmarEliminar = () => {
    if (itemToDelete) {
      eliminarDelCarrito(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const getPicanteTexto = (nivel) => {
    if (!nivel && nivel !== 0) return "";
    if (nivel === 0) return "Sin picante";
    if (nivel === 1) return "Suave";
    if (nivel === 2) return "Medio bajo";
    if (nivel === 3) return "Medio";
    if (nivel === 4) return "Picante";
    return "Muy picante";
  };

  const calcularPropinaMonto = () => {
    if (propina > 0) {
      return (totalPrecio * propina) / 100;
    } else if (propinaPersonalizada && parseFloat(propinaPersonalizada) > 0) {
      return parseFloat(propinaPersonalizada);
    }
    return 0;
  };

  const calcularTotalConPropina = () => {
    return totalPrecio + calcularPropinaMonto();
  };

  useEffect(() => {
    localStorage.setItem("propina", JSON.stringify(propina));
  }, [propina]);

  useEffect(() => {
    localStorage.setItem("propinaPersonalizada", propinaPersonalizada);
  }, [propinaPersonalizada]);

  if (carrito.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.carritoVacio}>
          <div className={styles.carritoVacioContent}>
            <h2>Tu carrito está vacío</h2>
            <p>¿Listo para pedir? Explora nuestro menú</p>
            <Link to="/menu" className={styles.btnMenu}>
              Ver menú
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      {/* Notificación flotante */}
      {notification?.show && (
        <div className={`${styles.notification} ${styles.notificationShow}`}>
          <span className={styles.notificationIcon}>✓</span>
          {notification.message}
        </div>
      )}

      {/* Modal de confirmación */}
      {itemToDelete && (
        <div
          className={styles.modalOverlay}
          onClick={() => setItemToDelete(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Eliminar producto</h3>
            <p>
              ¿Estás seguro de que quieres eliminar{" "}
              <strong>{itemToDelete.nombre}</strong> de tu carrito?
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={() => setItemToDelete(null)}
                className={styles.modalBtnCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarEliminar}
                className={styles.modalBtnConfirmar}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.carritoLayout}>
        {/* Columna izquierda - Productos */}
        <div className={styles.productosSection}>
          <div className={styles.sectionHeader}>
            <h1>Mi carrito</h1>
            {carrito.length > 0 && (
              <button onClick={vaciarCarrito} className={styles.btnVaciar}>
                Vaciar carrito
              </button>
            )}
          </div>

          {/* Lista de productos */}
          <div className={styles.listaProductos}>
            {carrito.map((item) => (
              <div key={item.id} className={styles.productoItem}>
                <img
                  src={item.imagen || "/images/default.jpg"}
                  alt={item.nombre}
                  className={styles.productoImagen}
                  onError={(e) => {
                    e.target.src = "/images/default.jpg";
                  }}
                />

                <div className={styles.productoInfo}>
                  <h3 className={styles.productoNombre}>{item.nombre}</h3>
                  <p className={styles.productoPrecio}>${item.precio.toFixed(2)} MXN</p>

                  {/* Personalizaciones */}
                  {item.personalizacion && (
                    <div className={styles.productoPersonalizacion}>
                      {item.personalizacion.nivelPicante !== undefined &&
                        (item.personalizacion.nivelPicante > 0 ||
                          item.personalizacion.nivelPicante === 0) && (
                          <span className={styles.badgePicante}>
                            {getPicanteTexto(item.personalizacion.nivelPicante)}
                          </span>
                        )}
                      {item.personalizacion.tipoArroz &&
                        item.personalizacion.tipoArroz !== "Arroz blanco" && (
                          <span className={styles.badgeArroz}>
                            {item.personalizacion.tipoArroz}
                          </span>
                        )}
                    </div>
                  )}
                  {item.personalizacion?.notasChef && (
                    <p className={styles.productoNota}>
                      Nota: {item.personalizacion.notasChef.substring(0, 50)}
                      {item.personalizacion.notasChef.length > 50 ? "..." : ""}
                    </p>
                  )}
                </div>

                <div className={styles.productoCantidad}>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                    className={styles.cantidadBtn}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span className={styles.cantidadValor}>{item.cantidad}</span>
                  <button
                    onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                    className={styles.cantidadBtn}
                  >
                    +
                  </button>
                </div>

                <div className={styles.productoSubtotal}>
                  <span className={styles.subtotalValor}>
                    ${(item.precio * item.cantidad).toFixed(2)} MXN
                  </span>
                  <button
                    onClick={() => handleEliminarClick(item)}
                    className={styles.btnEliminar}
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha - Resumen */}
        <div className={styles.resumenSection}>
          <h2 className={styles.resumenTitle}>Resumen del pedido</h2>

          {/* Propina */}
          <div className={styles.propinaSection}>
            <label className={styles.propinaLabel}>Propina</label>
            <div className={styles.propinaOpciones}>
              <button
                className={`${styles.propinaBtn} ${propina === 0 ? styles.propinaActive : ''}`}
                onClick={() => {
                  setPropina(0);
                  setPropinaPersonalizada("");
                }}
              >
                Sin propina
              </button>
              <button
                className={`${styles.propinaBtn} ${propina === 10 ? styles.propinaActive : ''}`}
                onClick={() => {
                  setPropina(10);
                  setPropinaPersonalizada("");
                }}
              >
                10%
              </button>
              <button
                className={`${styles.propinaBtn} ${propina === 15 ? styles.propinaActive : ''}`}
                onClick={() => {
                  setPropina(15);
                  setPropinaPersonalizada("");
                }}
              >
                15%
              </button>
              <button
                className={`${styles.propinaBtn} ${propina === 20 ? styles.propinaActive : ''}`}
                onClick={() => {
                  setPropina(20);
                  setPropinaPersonalizada("");
                }}
              >
                20%
              </button>
            </div>
            <div className={styles.propinaPersonalizada}>
              <input
                type="number"
                placeholder="Otra cantidad"
                className={styles.propinaInput}
                value={propinaPersonalizada}
                onChange={(e) => {
                  setPropinaPersonalizada(e.target.value);
                  setPropina(0);
                }}
              />
              <span className={styles.propinaMoneda}>MXN</span>
            </div>
          </div>

          {/* Totales */}
          <div className={styles.totalesSection}>
            <div className={styles.totalLinea}>
              <span>Subtotal</span>
              <span>${totalPrecio.toFixed(2)} MXN</span>
            </div>
            
            {propina > 0 && (
              <div className={styles.totalLinea}>
                <span>Propina ({propina}%)</span>
                <span>${((totalPrecio * propina) / 100).toFixed(2)} MXN</span>
              </div>
            )}
            
            {propinaPersonalizada && parseFloat(propinaPersonalizada) > 0 && (
              <div className={styles.totalLinea}>
                <span>Propina</span>
                <span>${parseFloat(propinaPersonalizada).toFixed(2)} MXN</span>
              </div>
            )}
            
            <div className={styles.totalLinea}>
              <span className={styles.envioTexto}>El costo del envío ya viene incluido</span>
              <span className={styles.envioPrecio}>$ -- MXN</span>
            </div>
            
            <div className={styles.totalGrande}>
              <span>Total</span>
              <span className={styles.totalMonto}>
                ${calcularTotalConPropina().toFixed(2)} MXN
              </span>
            </div>
          </div>

          {/* Botón de compra */}
          <button onClick={handleProcederPago} className={styles.btnComprar}>
            Finalizar compra
          </button>

          <p className={styles.pagoSeguro}>Pago seguro</p>
        </div>
      </div>
    </div>
  );
};

export default Carrito;