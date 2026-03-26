import { useContext } from 'react';
import { PedidoContext } from '../context/PedidoContext';

export const usePedido = () => {
  const context = useContext(PedidoContext);
  if (!context) {
    throw new Error('usePedido debe ser usado dentro de un PedidoProvider');
  }
  return context;
};