import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import useSessionTimeout from "../../hooks/useSessionTimeout";
import SessionWarning from "../../components/SessionWarning/SessionWarning";
import styles from './EmpleadoPanel.module.css';

const EmpleadoPanel = () => {
  const { logout, user } = useAdmin();
  const navigate = useNavigate();
  
  // ✅ Cambiado a 10 minuto
  useSessionTimeout(10);
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  // ✅ Agregar key para reiniciar SessionWarning
  const [warningKey, setWarningKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // ✅ Función para extender sesión
  const handleExtendSession = () => {
    setWarningKey(prev => prev + 1);
    window.dispatchEvent(new Event('mousemove'));
  };

  // Estados de pedidos
  const estados = {
    pendiente: { label: 'Pendiente', color: '#ff9800', icon: '⏳' },
    preparacion: { label: 'En preparación', color: '#2196f3', icon: '👨‍🍳' },
    listo: { label: 'Listo para entregar', color: '#4caf50', icon: '✅' },
    entregado: { label: 'Entregado', color: '#9e9e9e', icon: '📦' }
  };

  // Cargar pedidos (simulado - después conectas con tu backend)
  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    setLoading(true);
    setTimeout(() => {
      const pedidosEjemplo = [
        {
          id: 1,
          numero: 'PED-001',
          cliente: 'Juan Pérez',
          estado: 'pendiente',
          total: 335,
          items: [
            { nombre: 'Salmón Nigiri', cantidad: 2, precio: 105 },
            { nombre: 'California Roll', cantidad: 1, precio: 125 }
          ],
          fecha: '2024-01-15 14:30'
        },
        {
          id: 2,
          numero: 'PED-002',
          cliente: 'María García',
          estado: 'preparacion',
          total: 520,
          items: [
            { nombre: 'Sashimi Variado', cantidad: 1, precio: 220 },
            { nombre: 'Rainbow Roll', cantidad: 2, precio: 150 }
          ],
          fecha: '2024-01-15 14:45'
        },
        {
          id: 3,
          numero: 'PED-003',
          cliente: 'Carlos López',
          estado: 'listo',
          total: 185,
          items: [
            { nombre: 'Rainbow Roll', cantidad: 1, precio: 185 }
          ],
          fecha: '2024-01-15 15:00'
        }
      ];
      setPedidos(pedidosEjemplo);
      setLoading(false);
    }, 500);
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    console.log(`Cambiando pedido ${pedidoId} a ${nuevoEstado}`);
    
    setPedidos(pedidos.map(pedido => 
      pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
    ));
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
                    <span className={styles.pedidoNumero}>#{pedido.numero}</span>
                    <span 
                      className={styles.pedidoEstado} 
                      style={{ background: estados[pedido.estado]?.color || '#999' }}
                    >
                      {estados[pedido.estado]?.icon} {estados[pedido.estado]?.label || pedido.estado}
                    </span>
                  </div>
                  
                  <div className={styles.pedidoInfo}>
                    <div><strong>Cliente:</strong> {pedido.cliente}</div>
                    <div><strong>Fecha:</strong> {pedido.fecha}</div>
                  </div>
                  
                  <div className={styles.pedidoItems}>
                    <strong>Productos:</strong>
                    <ul>
                      {pedido.items.map((item, idx) => (
                        <li key={idx}>
                          {item.cantidad}x {item.nombre} - ${item.cantidad * item.precio}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.pedidoTotal}>
                    <strong>Total:</strong> ${pedido.total}
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