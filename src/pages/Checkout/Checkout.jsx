// src/pages/Checkout/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, totalPrecio, vaciarCarrito } = useCarrito();
  const [propina, setPropina] = useState(0);
  const [propinaPersonalizada, setPropinaPersonalizada] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    metodoPago: "efectivo",
    numeroTarjeta: "",
    nombreTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Cargar la propina del localStorage al montar el componente
  useEffect(() => {
    const savedPropina = localStorage.getItem("propina");
    const savedPropinaPersonalizada = localStorage.getItem("propinaPersonalizada");
    
    if (savedPropina) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPropina(JSON.parse(savedPropina));
    }
    if (savedPropinaPersonalizada) {
      setPropinaPersonalizada(savedPropinaPersonalizada);
    }
  }, []);

  const getTiempoEstimado = () => {
    const hora = new Date().getHours();
    if (hora >= 13 && hora <= 15) {
      return "35-45 minutos";
    }
    return "25-35 minutos";
  };

  const calcularTotalConPropina = () => {
    let propinaMonto = 0;
    if (propina > 0) {
      propinaMonto = (totalPrecio * propina) / 100;
    } else if (propinaPersonalizada && parseFloat(propinaPersonalizada) > 0) {
      propinaMonto = parseFloat(propinaPersonalizada);
    }
    return totalPrecio + propinaMonto;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numeroTarjeta") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === "fechaExpiracion") {
      let cleaned = value.replace(/\D/g, "").slice(0, 4);
      if (cleaned.length >= 3) {
        cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
      }
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarTarjeta = () => {
    const numeroLimpio = formData.numeroTarjeta.replace(/\s/g, "");
    if (numeroLimpio.length !== 16) {
      setError("Número de tarjeta inválido (debe tener 16 dígitos)");
      return false;
    }
    if (formData.nombreTarjeta.trim() === "") {
      setError("Nombre en la tarjeta es requerido");
      return false;
    }
    if (formData.fechaExpiracion.length !== 5) {
      setError("Fecha de expiración inválida (MM/AA)");
      return false;
    }
    if (formData.cvv.length !== 3) {
      setError("CVV inválido (3 dígitos)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.nombre || !formData.telefono || !formData.direccion) {
      setError("Por favor, completa todos los campos requeridos");
      return;
    }

    if (formData.metodoPago === "tarjeta") {
      if (!validarTarjeta()) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      localStorage.setItem("userName", formData.nombre.split(" ")[0]);

      const propinaMonto = propina > 0 
        ? (totalPrecio * propina) / 100 
        : (propinaPersonalizada && parseFloat(propinaPersonalizada) > 0 ? parseFloat(propinaPersonalizada) : 0);

      const nuevoPedido = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        items: carrito.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
          imagen: item.imagen,
        })),
        productos: carrito.map((item) => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
        })),
        subtotal: totalPrecio,
        propina: propinaMonto,
        total: totalPrecio + propinaMonto,
        tiempoEstimado: getTiempoEstimado(),
        estado: "confirmado",
        metodoPago: formData.metodoPago,
        datosCliente: {
          nombre: formData.nombre,
          telefono: formData.telefono,
          direccion: formData.direccion,
        },
      };

      const pedidosGuardados = localStorage.getItem("pedidos");
      let pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
      pedidos.push(nuevoPedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidos));

      // Limpiar la propina del localStorage después de realizar el pedido
      localStorage.removeItem("propina");
      localStorage.removeItem("propinaPersonalizada");

      vaciarCarrito();

      setIsSubmitting(false);

      navigate("/confirmacion", {
        state: {
          pedido: {
            id: nuevoPedido.id,
            tiempoEstimado: nuevoPedido.tiempoEstimado,
            total: nuevoPedido.total,
            productos: nuevoPedido.productos,
          },
        },
      });
    } catch (err) {
      console.error("Error al procesar el pedido:", err);
      setError(
        "Ocurrió un error al procesar tu pedido. Por favor, intenta de nuevo."
      );
      setIsSubmitting(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartContent}>
          <div className={styles.emptyCartIcon}></div>
          <h2>Tu carrito está vacío</h2>
          <p>No puedes continuar con el pago sin productos en el carrito</p>
          <button onClick={() => navigate("/menu")} className={styles.btnMenu}>
            Ir al menú
          </button>
        </div>
      </div>
    );
  }

  const propinaMonto = propina > 0 
    ? (totalPrecio * propina) / 100 
    : (propinaPersonalizada && parseFloat(propinaPersonalizada) > 0 ? parseFloat(propinaPersonalizada) : 0);

  return (
    <div className={styles.checkout}>
      <div className={styles.checkoutHeader}>
        <h1>Finalizar Pedido</h1>
        <p>Completa tus datos para confirmar tu pedido</p>
      </div>

      <div className={styles.container}>
        <div className={styles.formSection}>
          <div className={styles.sectionTitle}>
            <div className={styles.titleIcon}></div>
            <h2>Datos de contacto</h2>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                placeholder="Tu teléfono"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Dirección de entrega</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
                placeholder="Calle, número, colonia"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Método de pago</label>
              <div className={styles.paymentMethods}>
                <label
                  className={`${styles.paymentOption} ${
                    formData.metodoPago === "efectivo" ? styles.paymentActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="efectivo"
                    checked={formData.metodoPago === "efectivo"}
                    onChange={handleChange}
                  />
                  <span>Efectivo</span>
                </label>
                <label
                  className={`${styles.paymentOption} ${
                    formData.metodoPago === "tarjeta" ? styles.paymentActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="tarjeta"
                    checked={formData.metodoPago === "tarjeta"}
                    onChange={handleChange}
                  />
                  <span>Tarjeta de crédito/débito</span>
                </label>
                <label
                  className={`${styles.paymentOption} ${
                    formData.metodoPago === "transferencia" ? styles.paymentActive : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={formData.metodoPago === "transferencia"}
                    onChange={handleChange}
                  />
                  <span>Transferencia bancaria</span>
                </label>
              </div>
            </div>

            {formData.metodoPago === "tarjeta" && (
              <div className={styles.tarjetaSection}>
                <h3>Datos de la tarjeta</h3>

                <div className={styles.formGroup}>
                  <label>Número de tarjeta</label>
                  <input
                    type="text"
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    placeholder="**** **** **** ****"
                    maxLength="19"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nombre en la tarjeta</label>
                  <input
                    type="text"
                    name="nombreTarjeta"
                    value={formData.nombreTarjeta}
                    onChange={handleChange}
                    placeholder="Como aparece en la tarjeta"
                  />
                </div>

                <div className={styles.tarjetaRow}>
                  <div className={styles.formGroup}>
                    <label>Fecha expiración</label>
                    <input
                      type="text"
                      name="fechaExpiracion"
                      value={formData.fechaExpiracion}
                      onChange={handleChange}
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="***"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.metodoPago === "transferencia" && (
              <div className={styles.transferenciaInfo}>
                <h3>Datos para transferencia</h3>
                <div className={styles.bankInfo}>
                  <p><strong>Banco:</strong> BBVA</p>
                  <p><strong>Cuenta:</strong> 1234 5678 9012 3456</p>
                  <p><strong>CLABE:</strong> 012345678901234567</p>
                  <p><strong>Beneficiario:</strong> SushiRoom</p>
                </div>
                <p className={styles.note}>
                  Realiza la transferencia y envía el comprobante por WhatsApp al finalizar el pedido
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.btnSubmit}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Procesando pago...
                </>
              ) : (
                `Confirmar pedido - $${calcularTotalConPropina().toFixed(2)} MXN`
              )}
            </button>
          </form>
        </div>

        <div className={styles.resumenSection}>
          <div className={styles.sectionTitle}>
            <div className={styles.titleIcon}></div>
            <h2>Resumen del pedido</h2>
          </div>
          
          <div className={styles.itemsList}>
            {carrito.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCantidad}>{item.cantidad}x</span>
                  <span className={styles.itemNombre}>{item.nombre}</span>
                </div>
                <span className={styles.itemPrecio}>
                  ${(item.precio * item.cantidad).toFixed(2)} MXN
                </span>
              </div>
            ))}
          </div>

          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>${totalPrecio.toFixed(2)} MXN</span>
          </div>
          
          {propinaMonto > 0 && (
            <div className={styles.totalRow}>
              <span>Propina</span>
              <span>${propinaMonto.toFixed(2)} MXN</span>
            </div>
          )}
          
          <div className={styles.totalRow}>
            <span className={styles.envioTexto}>Envío</span>
            <span className={styles.envioPrecio}>Gratis</span>
          </div>
          
          <div className={styles.totalGrande}>
            <span>Total a pagar</span>
            <span className={styles.totalMonto}>
              ${calcularTotalConPropina().toFixed(2)} MXN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;