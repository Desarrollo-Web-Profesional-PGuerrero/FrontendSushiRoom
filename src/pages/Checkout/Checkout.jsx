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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Cargar la propina del localStorage al montar el componente
  useEffect(() => {
    const savedPropina = localStorage.getItem("propina");
    const savedPropinaPersonalizada = localStorage.getItem("propinaPersonalizada");
    
    if (savedPropina) {
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

  // ==================== VALIDACIONES ====================
  const validarNombre = (nombre) => {
    if (!nombre || nombre.trim() === "") {
      return "El nombre es obligatorio";
    }
    if (nombre.trim().length < 3) {
      return "El nombre debe tener al menos 3 caracteres";
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return "El nombre solo puede contener letras";
    }
    return "";
  };

  const validarTelefono = (telefono) => {
    if (!telefono || telefono.trim() === "") {
      return "El teléfono es obligatorio";
    }
    const telefonoLimpio = telefono.replace(/\D/g, "");
    if (telefonoLimpio.length !== 10) {
      return "El teléfono debe tener 10 dígitos";
    }
    return "";
  };

  const validarDireccion = (direccion) => {
    if (!direccion || direccion.trim() === "") {
      return "La dirección es obligatoria";
    }
    if (direccion.trim().length < 5) {
      return "La dirección debe ser más específica";
    }
    return "";
  };

  const validarNumeroTarjeta = (numero) => {
    const numeroLimpio = numero.replace(/\s/g, "");
    if (numeroLimpio.length !== 16) {
      return "El número de tarjeta debe tener 16 dígitos";
    }
    return "";
  };

  const validarNombreTarjeta = (nombre) => {
    if (!nombre || nombre.trim() === "") {
      return "El nombre en la tarjeta es obligatorio";
    }
    return "";
  };

  const validarFechaExpiracion = (fecha) => {
    if (!fecha || fecha.length !== 5) {
      return "Ingresa una fecha válida (MM/AA)";
    }
    const [mes, anio] = fecha.split("/");
    const mesNum = parseInt(mes, 10);
    const anioNum = parseInt(anio, 10);
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear() % 100;
    const mesActual = fechaActual.getMonth() + 1;

    if (mesNum < 1 || mesNum > 12) {
      return "El mes debe ser entre 01 y 12";
    }
    if (anioNum < anioActual || (anioNum === anioActual && mesNum < mesActual)) {
      return "La tarjeta está vencida";
    }
    return "";
  };

  const validarCVV = (cvv) => {
    const cvvLimpio = cvv.replace(/\D/g, "");
    if (cvvLimpio.length !== 3) {
      return "El CVV debe tener 3 dígitos";
    }
    return "";
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
      if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validarNumeroTarjeta(formatted) }));
      }
      return;
    }

    if (name === "fechaExpiracion") {
      let cleaned = value.replace(/\D/g, "").slice(0, 4);
      if (cleaned.length >= 3) {
        cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
      }
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validarFechaExpiracion(cleaned) }));
      }
      return;
    }

    if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      if (touched[name]) {
        setErrors(prev => ({ ...prev, [name]: validarCVV(cleaned) }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      let errorMsg = "";
      switch (name) {
        case "nombre": errorMsg = validarNombre(value); break;
        case "telefono": errorMsg = validarTelefono(value); break;
        case "direccion": errorMsg = validarDireccion(value); break;
        case "nombreTarjeta": errorMsg = validarNombreTarjeta(value); break;
        default: break;
      }
      setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    let errorMsg = "";
    switch (name) {
      case "nombre": errorMsg = validarNombre(value); break;
      case "telefono": errorMsg = validarTelefono(value); break;
      case "direccion": errorMsg = validarDireccion(value); break;
      case "numeroTarjeta": errorMsg = validarNumeroTarjeta(value); break;
      case "nombreTarjeta": errorMsg = validarNombreTarjeta(value); break;
      case "fechaExpiracion": errorMsg = validarFechaExpiracion(value); break;
      case "cvv": errorMsg = validarCVV(value); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const validarTarjeta = () => {
    const numeroError = validarNumeroTarjeta(formData.numeroTarjeta);
    const nombreError = validarNombreTarjeta(formData.nombreTarjeta);
    const fechaError = validarFechaExpiracion(formData.fechaExpiracion);
    const cvvError = validarCVV(formData.cvv);

    setErrors(prev => ({
      ...prev,
      numeroTarjeta: numeroError,
      nombreTarjeta: nombreError,
      fechaExpiracion: fechaError,
      cvv: cvvError
    }));

    if (numeroError || nombreError || fechaError || cvvError) {
      setError("Por favor, verifica los datos de tu tarjeta");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nombreError = validarNombre(formData.nombre);
    const telefonoError = validarTelefono(formData.telefono);
    const direccionError = validarDireccion(formData.direccion);

    setTouched({
      nombre: true,
      telefono: true,
      direccion: true,
      ...(formData.metodoPago === "tarjeta" && {
        numeroTarjeta: true,
        nombreTarjeta: true,
        fechaExpiracion: true,
        cvv: true
      })
    });

    setErrors({
      nombre: nombreError,
      telefono: telefonoError,
      direccion: direccionError
    });

    if (nombreError || telefonoError || direccionError) {
      setError("Por favor, completa todos los campos requeridos correctamente");
      return;
    }

    if (formData.metodoPago === "tarjeta") {
      if (!validarTarjeta()) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const propinaMonto = propina > 0 
        ? (totalPrecio * propina) / 100 
        : (propinaPersonalizada && parseFloat(propinaPersonalizada) > 0 ? parseFloat(propinaPersonalizada) : 0);

      // ========== ENVIAR AL BACKEND ==========
      const itemsParaBackend = carrito.map(item => ({
        productoId: item.id,
        nombreProducto: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
      }));

      const datosPedido = {
        metodoPago: formData.metodoPago === "efectivo" ? "Efectivo" : 
                    formData.metodoPago === "tarjeta" ? "Tarjeta" : "Transferencia",
        comentarios: `Cliente: ${formData.nombre} - Tel: ${formData.telefono} - Dirección: ${formData.direccion}`,
        items: itemsParaBackend
      };

      console.log("📤 Enviando pedido al backend:", datosPedido);

      const response = await fetch('http://localhost:8080/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPedido)
      });

      const data = await response.json();
      console.log("📥 Respuesta del backend:", data);

      if (!response.ok) {
        throw new Error(data.message || "Error al crear el pedido");
      }

      // Guardar también en localStorage para compatibilidad
      const nuevoPedido = {
        numeroPedido: data.pedido?.numeroPedido || `PED-${Date.now()}`,
        id: data.pedido?.id || Date.now(),
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
        estado: "pendiente",
        metodoPago: formData.metodoPago,
        datosCliente: {
          nombre: formData.nombre,
          telefono: formData.telefono,
          direccion: formData.direccion,
        },
      };

      console.log("📦 Pedido creado:", nuevoPedido);

      // Guardar en localStorage
      const pedidosGuardados = localStorage.getItem("pedidos");
      let pedidos = pedidosGuardados ? JSON.parse(pedidosGuardados) : [];
      pedidos.push(nuevoPedido);
      localStorage.setItem("pedidos", JSON.stringify(pedidos));

      // Limpiar datos temporales
      localStorage.removeItem("propina");
      localStorage.removeItem("propinaPersonalizada");
      localStorage.setItem("userName", formData.nombre.split(" ")[0]);

      vaciarCarrito();
      setIsSubmitting(false);

      // Redirigir a confirmación con el número de pedido del backend
      navigate("/confirmacion", {
        state: {
          pedido: {
            numeroPedido: data.pedido?.numeroPedido || nuevoPedido.numeroPedido,
            id: data.pedido?.id || nuevoPedido.id,
            tiempoEstimado: nuevoPedido.tiempoEstimado,
            total: nuevoPedido.total,
            productos: nuevoPedido.productos,
          },
        },
      });
    } catch (err) {
      console.error("❌ Error al procesar el pedido:", err);
      setError(err.message || "Ocurrió un error al procesar tu pedido. Por favor, intenta de nuevo.");
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
              <label>Nombre completo *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tu nombre"
                className={touched.nombre && errors.nombre ? styles.inputError : ""}
              />
              {touched.nombre && errors.nombre && (
                <span className={styles.errorText}>{errors.nombre}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tu teléfono"
                className={touched.telefono && errors.telefono ? styles.inputError : ""}
              />
              {touched.telefono && errors.telefono && (
                <span className={styles.errorText}>{errors.telefono}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Dirección de entrega *</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Calle, número, colonia"
                className={touched.direccion && errors.direccion ? styles.inputError : ""}
              />
              {touched.direccion && errors.direccion && (
                <span className={styles.errorText}>{errors.direccion}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Método de pago *</label>
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
                  <span>💵 Efectivo</span>
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
                  <span>💳 Tarjeta de crédito/débito</span>
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
                    onBlur={handleBlur}
                    placeholder="**** **** **** ****"
                    maxLength="19"
                    className={touched.numeroTarjeta && errors.numeroTarjeta ? styles.inputError : ""}
                  />
                  {touched.numeroTarjeta && errors.numeroTarjeta && (
                    <span className={styles.errorText}>{errors.numeroTarjeta}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Nombre en la tarjeta *</label>
                  <input
                    type="text"
                    name="nombreTarjeta"
                    value={formData.nombreTarjeta}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Como aparece en la tarjeta"
                    className={touched.nombreTarjeta && errors.nombreTarjeta ? styles.inputError : ""}
                  />
                  {touched.nombreTarjeta && errors.nombreTarjeta && (
                    <span className={styles.errorText}>{errors.nombreTarjeta}</span>
                  )}
                </div>

                <div className={styles.tarjetaRow}>
                  <div className={styles.formGroup}>
                    <label>Fecha expiración *</label>
                    <input
                      type="text"
                      name="fechaExpiracion"
                      value={formData.fechaExpiracion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="MM/AA"
                      maxLength="5"
                      className={touched.fechaExpiracion && errors.fechaExpiracion ? styles.inputError : ""}
                    />
                    {touched.fechaExpiracion && errors.fechaExpiracion && (
                      <span className={styles.errorText}>{errors.fechaExpiracion}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="***"
                      maxLength="3"
                      className={touched.cvv && errors.cvv ? styles.inputError : ""}
                    />
                    {touched.cvv && errors.cvv && (
                      <span className={styles.errorText}>{errors.cvv}</span>
                    )}
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