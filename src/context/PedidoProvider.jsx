// src/context/PedidoProvider.jsx
import React, { useState, useCallback } from 'react';
import { PedidoContext } from './PedidoContext';
import { PASOS_PEDIDO } from '../constants/pedidoConstantes';

export const PedidoProvider = ({ children }) => {
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Asegúrate de que obtenerPedido esté memorizado con useCallback
const obtenerPedido = useCallback(async (id) => {
  setLoading(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pedidosGuardados = localStorage.getItem('pedidos');
    console.log('🔍 Buscando pedido ID:', id);
    
    if (pedidosGuardados) {
      const pedidos = JSON.parse(pedidosGuardados);
      const pedido = pedidos.find(p => p.id === id);
      
      if (pedido) {
        console.log('✅ Pedido encontrado:', pedido);
        setPedidoActivo(pedido);
        return pedido;
      }
    }
    
    setPedidoActivo(null);
    return null;
  } catch (error) {
    console.error('Error:', error);
    setPedidoActivo(null);
    return null;
  } finally {
    setLoading(false);
  }
}, []); // Array vacío para que no se recree

  const actualizarEstadoPedido = (nuevoEstado) => {
    if (pedidoActivo) {
      const pedidoActualizado = {
        ...pedidoActivo,
        estado: nuevoEstado
      };
      setPedidoActivo(pedidoActualizado);
      
      // También actualizar en localStorage
      const pedidosGuardados = localStorage.getItem('pedidos');
      if (pedidosGuardados) {
        const pedidos = JSON.parse(pedidosGuardados);
        const index = pedidos.findIndex(p => p.id === pedidoActivo.id);
        if (index !== -1) {
          pedidos[index] = pedidoActualizado;
          localStorage.setItem('pedidos', JSON.stringify(pedidos));
          console.log('🔄 Pedido actualizado en localStorage:', pedidoActualizado);
        }
      }
    }
  };

  const value = {
    pedidoActivo,
    loading,
    obtenerPedido,
    actualizarEstadoPedido,
    pasos: PASOS_PEDIDO
  };

  return (
    <PedidoContext.Provider value={value}>
      {children}
    </PedidoContext.Provider>
  );
};