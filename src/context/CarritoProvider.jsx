// src/context/CarritoProvider.jsx
import React, { useState, useEffect } from "react";
import { CarritoContext } from "./CarritoContext";

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("carrito");
    if (savedCart) {
      try {
        setCarrito(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al cargar carrito:", e);
        setCarrito([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Mostrar notificación temporal
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 2000);
  };

  // Calcular total de items
  const totalItems = carrito.reduce(
    (sum, item) => sum + (item.cantidad || 0),
    0,
  );

  // Calcular precio total
  const totalPrecio = carrito.reduce(
    (sum, item) => sum + (item.precio || 0) * (item.cantidad || 0),
    0,
  );

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prevCarrito) => {
      const existe = prevCarrito.find((item) => item.id === producto.id);

      if (existe) {
        const nuevoCarrito = prevCarrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: (item.cantidad || 0) + cantidad }
            : item,
        );
        showNotification(`+${cantidad} ${producto.nombre} agregado`);
        return nuevoCarrito;
      }

      showNotification(`${producto.nombre} agregado al carrito`);
      return [...prevCarrito, { ...producto, cantidad }];
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => item.id !== productoId),
    );
    showNotification("Producto eliminado del carrito");
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item,
      ),
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    showNotification("Carrito vaciado");
  };

  const value = {
    carrito,
    totalItems,
    totalPrecio,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    notification,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};
