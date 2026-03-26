import React, { useState } from 'react';
import { PedidoContext } from './PedidoContext';
import { PASOS_PEDIDO } from '../constants/pedidoConstantes';

// Datos de ejemplo que vendrían de PostgreSQL
const pedidosMock = {
  1: {
    id: 1,
    estado: 'confirmado',
    fecha: '2024-01-20T10:30:00',
    total: 325.00,
    items: [
      { nombre: 'Salmón Nigiri', cantidad: 2, precio: 105.00 },
      { nombre: 'Roll California', cantidad: 1, precio: 125.00 }
    ]
  },
  2: {
    id: 2,
    estado: 'preparacion',
    fecha: '2024-01-20T11:15:00',
    total: 480.00,
    items: [
      { nombre: 'Atún Nigiri', cantidad: 3, precio: 115.00 },
      { nombre: 'Sashimi Salmón', cantidad: 1, precio: 120.00 },
      { nombre: 'Ebi Roll', cantidad: 1, precio: 110.00 }
    ]
  },
  3: {
    id: 3,
    estado: 'en_camino',
    fecha: '2024-01-20T12:00:00',
    total: 235.00,
    items: [
      { nombre: 'Roll Spicy Tuna', cantidad: 1, precio: 130.00 },
      { nombre: 'Ebi Roll', cantidad: 1, precio: 110.00 }
    ]
  }
};

export const PedidoProvider = ({ children }) => {
  const [pedidoActivo, setPedidoActivo] = useState(pedidosMock[2]);
  const [loading, setLoading] = useState(false);

  const actualizarEstadoPedido = (nuevoEstado) => {
    setPedidoActivo(prev => ({
      ...prev,
      estado: nuevoEstado
    }));
  };

  const obtenerPedido = async (id) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const pedido = pedidosMock[id];
      if (pedido) {
        setPedidoActivo(pedido);
      }
      return pedido;
    } finally {
      setLoading(false);
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