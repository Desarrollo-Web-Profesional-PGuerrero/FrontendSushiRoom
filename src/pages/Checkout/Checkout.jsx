// src/pages/Checkout/Checkout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../hooks/useCarrito";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, totalPrecio, vaciarCarrito } = useCarrito();
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    instrucciones: "",
    metodoPago: "efectivo",
    numeroTarjeta: "",
    nombreTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Tiempo estimado basado en la hora actual
  const getTiempoEstimado = () => {
    const hora = new Date().getHours();
    if (hora >= 13 && hora <= 15) {
      return "35-45 minutos"; // Horas pico
    }
    return "25-35 minutos";
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
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Guardar nombre del usuario para usarlo en confirmación
      localStorage.setItem("userName", formData.nombre.split(" ")[0]);

      // Crear pedido
      const nuevoPedido = {
        id: Date.now(), // ← Usar timestamp numérico: 1743391234567
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
        total: totalPrecio,
        tiempoEstimado: getTiempoEstimado(),
        estado: "confirmado",
        metodoPago: formData.metodoPago,
        datosCliente: {
          nombre: formData.nombre,
          telefono: formData.telefono,
          direccion: formData.direccion,
          instrucciones: formData.instrucciones,
        },
      };

      console.log("Nuevo pedido creado:", nuevoPedido);

      // Guardar en localStorage
      const pedidosGuardados = localStorage.getItem("pedidos");
      let pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
      pedidos.push(nuevoPedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidos));

      // Limpiar carrito
      vaciarCarrito();

      setIsSubmitting(false);

      // 🎉 NUEVO: Redirigir a Confirmación con los datos del pedido
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
        "Ocurrió un error al procesar tu pedido. Por favor, intenta de nuevo.",
      );
      setIsSubmitting(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Tu carrito está vacío</h2>
        <p>No puedes continuar con el pago sin productos en el carrito</p>
        <button onClick={() => navigate("/menu")} className={styles.btnMenu}>
          Ir al menú
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <h1>Finalizar Pedido</h1>

      <div className={styles.container}>
        <div className={styles.formSection}>
          <h2>Datos de contacto</h2>

          {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nombre completo *</label>
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
              <label>Teléfono *</label>
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
              <label>Dirección de entrega *</label>
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
              <label>Instrucciones especiales</label>
              <textarea
                name="instrucciones"
                value={formData.instrucciones}
                onChange={handleChange}
                rows="3"
                placeholder="¿Alguna indicación? (ej: sin cebolla, extra picante...)"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Método de pago *</label>
              <div className={styles.paymentMethods}>
                <label
                  className={`${styles.paymentOption} ${formData.metodoPago === "efectivo" ? styles.paymentActive : ""}`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="efectivo"
                    checked={formData.metodoPago === "efectivo"}
                    onChange={handleChange}
                  />
                  <span>💵 Efectivo</span>
                </label>
                <label
                  className={`${styles.paymentOption} ${formData.metodoPago === "tarjeta" ? styles.paymentActive : ""}`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="tarjeta"
                    checked={formData.metodoPago === "tarjeta"}
                    onChange={handleChange}
                  />
                  <span>💳 Tarjeta de crédito/débito</span>
                </label>
                <label
                  className={`${styles.paymentOption} ${formData.metodoPago === "transferencia" ? styles.paymentActive : ""}`}
                >
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={formData.metodoPago === "transferencia"}
                    onChange={handleChange}
                  />
                  <span>🏦 Transferencia bancaria</span>
                </label>
              </div>
            </div>

            {formData.metodoPago === "tarjeta" && (
              <div className={styles.tarjetaSection}>
                <h3>Datos de la tarjeta</h3>

                <div className={styles.formGroup}>
                  <label>Número de tarjeta *</label>
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
                  <label>Nombre en la tarjeta *</label>
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
                    <label>Fecha expiración *</label>
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
                    <label>CVV *</label>
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
                <p>Banco: BBVA</p>
                <p>Cuenta: 1234 5678 9012 3456</p>
                <p>CLABE: 012345678901234567</p>
                <p>Beneficiario: SushiRoom</p>
                <p className={styles.note}>
                  * Realiza la transferencia y envía el comprobante por WhatsApp
                  al finalizar el pedido
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
                `Confirmar pedido - $${totalPrecio.toFixed(2)} MXN`
              )}
            </button>
          </form>
        </div>

        <div className={styles.resumenSection}>
          <h2>Resumen del pedido</h2>
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

          <div className={styles.total}>
            <span>Subtotal</span>
            <span>${totalPrecio.toFixed(2)} MXN</span>
          </div>
          <div className={styles.total}>
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className={styles.totalGrande}>
            <span>Total a pagar</span>
            <span className={styles.totalMonto}>
              ${totalPrecio.toFixed(2)} MXN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
