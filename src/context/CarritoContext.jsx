// src/context/CarritoContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto (versión mejorada de main)
const CarritoContext = createContext(null);

// Hook personalizado para usar el carrito (de main)
export const useCart = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

// Exportar el contexto para uso directo (de gerardo, por compatibilidad)
export { CarritoContext };

// Provider principal (de main, con funcionalidad completa)
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', product: null });

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Mostrar notificación temporal
  const showNotification = (message, product) => {
    setNotification({ show: true, message, product });
    setTimeout(() => {
      setNotification({ show: false, message: '', product: null });
    }, 2000);
  };

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, aumentar cantidad
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        showNotification(`+${quantity} ${product.nombre} agregado`, product);
        return updatedCart;
      } else {
        // Si no existe, agregar nuevo
        showNotification(`${product.nombre} agregado al carrito`, product);
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    showNotification('Producto eliminado del carrito', null);
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
    showNotification('Carrito vaciado', null);
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Contar total de items
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    notification
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};