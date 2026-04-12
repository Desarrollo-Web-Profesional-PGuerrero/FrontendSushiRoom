import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import useSessionTimeout from "../../hooks/useSessionTimeout";
import SessionWarning from "../../components/SessionWarning/SessionWarning";
import styles from './EmpleadoPanel.module.css';
import { API_URL } from '../../services/api';

const EmpleadoPanel = () => {
  const { logout, user } = useAdmin();
  const navigate = useNavigate();
  
  useSessionTimeout(10);
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [warningKey, setWarningKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleExtendSession = () => {
    setWarningKey(prev => prev + 1);
    window.dispatchEvent(new Event('mousemove'));
  };

  const estados = {
    pendiente: { label: 'Pendiente', color: '#ff9800', icon: '⏳' },
    preparacion: { label: 'En preparación', color: '#2196f3', icon: '👨‍🍳' },
    listo: { label: 'Listo para entregar', color: '#4caf50', icon: '✅' },
    entregado: { label: 'Entregado', color: '#9e9e9e', icon: '📦' }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // ✅ CORREGIDO: Usar API_URL en lugar de datos simulados
  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pedidos`);
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        console.error('Error al cargar pedidos:', response.status);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORREGIDO: Usar API_URL para cambiar estado
  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      
      if (response.ok) {
        cargarPedidos();
        alert(`Pedido actualizado a ${estados[nuevoEstado]?.label || nuevoEstado}`);
      } else {
        console.error('Error al cambiar estado:', response.status);
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado del pedido');
    }
  };

  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  return (
    <div className={styles.empleadoPanel}>
      <SessionWarning 
        key={warningKey}
        timeoutMinutes={10} 
        onExtend={handleExtendSession}
      />
      
      <button className={styles.menuHamburger} onClick={toggleMobileMenu}>
        <span>☰</span>
      </button>

      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={toggleMobileMenu}></div>
      )}

      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <h2>The Sushi Room</h2>
          <p>Panel de Empleado</p>
        </div>
        
        <div className={styles.userInfo}>
          <p>👤 {user?.nombre || 'Empleado'}</p>
        </div>
        
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.navItemActive}`}>
            <span>📋 Pedidos</span>
          </button>
        </nav>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span>➜</span>
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <h1>Gestión de Pedidos</h1>
          <p>Administra los pedidos de los clientes</p>
        </div>

        <div className={styles.filtrosContainer}>
          {['todos', 'pendiente', 'preparacion', 'listo', 'entregado'].map(estado => (
            <button
              key={estado}
              className={`${styles.filtroBtn} ${filtroEstado === estado ? styles.filtroActivo : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado === 'todos' ? 'Todos' : estados[estado]?.label || estado}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando pedidos...</div>
        ) : (
          <div className={styles.pedidosGrid}>
            {pedidosFiltrados.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No hay pedidos en esta categoría</p>
              </div>
            ) : (
              pedidosFiltrados.map(pedido => (
                <div key={pedido.id} className={styles.pedidoCard}>
                  <div className={styles.pedidoHeader}>
                    <span className={styles.pedidoNumero}>#{pedido.numeroPedido}</span>
                    <span 
                      className={styles.pedidoEstado} 
                      style={{ background: estados[pedido.estado]?.color || '#999' }}
                    >
                      {estados[pedido.estado]?.icon} {estados[pedido.estado]?.label || pedido.estado}
                    </span>
                  </div>
                  
                  <div className={styles.pedidoInfo}>
                    <div><strong>Cliente:</strong> {pedido.usuario?.nombre || 'Cliente no registrado'}</div>
                    <div><strong>Fecha:</strong> {new Date(pedido.fechaPedido).toLocaleString()}</div>
                    <div><strong>Total:</strong> ${pedido.total}</div>
                  </div>
                  
                  <div className={styles.pedidoItems}>
                    <strong>Productos:</strong>
                    <ul>
                      {pedido.detalles?.map((item, idx) => (
                        <li key={idx}>
                          {item.cantidad}x {item.nombreProducto} - ${item.cantidad * item.precioUnitario}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.pedidoAcciones}>
                    {pedido.estado === 'pendiente' && (
                      <button 
                        className={styles.btnPreparar}
                        onClick={() => cambiarEstado(pedido.id, 'preparacion')}
                      >
                        Iniciar preparación
                      </button>
                    )}
                    {pedido.estado === 'preparacion' && (
                      <button 
                        className={styles.btnListo}
                        onClick={() => cambiarEstado(pedido.id, 'listo')}
                      >
                        Marcar como listo
                      </button>
                    )}
                    {pedido.estado === 'listo' && (
                      <button 
                        className={styles.btnEntregar}
                        onClick={() => cambiarEstado(pedido.id, 'entregado')}
                      >
                        Marcar como entregado
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmpleadoPanel;