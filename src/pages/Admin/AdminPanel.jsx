import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import useSessionTimeout from "../../hooks/useSessionTimeout";
import SessionWarning from "../../components/SessionWarning/SessionWarning";
import styles from './AdminPanel.module.css';
import { API_URL } from '../../services/api';

const AdminPanel = () => {
  const { logout, productos, agregarProducto, editarProducto, eliminarProducto, user, categorias: categoriasBackend } = useAdmin();
  const navigate = useNavigate();
  
  console.log('📦 AdminPanel montado - Llamando a useSessionTimeout');
  useSessionTimeout(10);
  
  const [activeTab, setActiveTab] = useState('productos');
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editandoEmpleado, setEditandoEmpleado] = useState(null);
  const [empleadoEditForm, setEmpleadoEditForm] = useState({
    nombre: '',
    email: '',
    rol: 'empleado'
  });
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    email: '',
    password: ''
  });

  const [pedidos, setPedidos] = useState([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [resumenPedidos, setResumenPedidos] = useState({});
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const paisesOrigen = [
    'Japón', 'Noruega', 'Chile', 'España', 'México',
    'Perú', 'Canadá', 'Estados Unidos', 'Francia', 'Italia',
    'Tailandia', 'Vietnam', 'Corea del Sur', 'China', 'Australia'
  ];

  const ingredientesPredeterminados = [
    'Arroz', 'Alga nori', 'Salmón', 'Atún', 'Camarón', 'Pulpo',
    'Aguacate', 'Pepino', 'Cangrejo', 'Queso crema', 'Mayonesa',
    'Salsa de soya', 'Wasabi', 'Jengibre', 'Sésamo', 'Cebollín',
    'Masago (hueva de pez)', 'Unagi (anguila)', 'Tobiko', 'Tamago (huevo)'
  ];

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    descripcion: '',
    origen: [],
    notasCata: '',
    ingredientes: [],
    imagen: ''
  });

  const [nuevoOrigen, setNuevoOrigen] = useState('');
  const [nuevoIngrediente, setNuevoIngrediente] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (categoriasBackend && categoriasBackend.length > 0 && !formData.categoria) {
      setFormData(prev => ({
        ...prev,
        categoria: categoriasBackend[0]?.nombre?.toLowerCase() || ''
      }));
    }
  }, [categoriasBackend, formData.categoria]);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const crearEmpleado = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEmpleado)
      });
      if (response.ok) {
        setShowUserForm(false);
        setNuevoEmpleado({ nombre: '', email: '', password: '' });
        cargarUsuarios();
        alert('Empleado creado exitosamente');
      } else {
        const error = await response.json();
        alert(error.message || 'Error al crear empleado');
      }
    } catch (error) {
      console.error('Error al crear empleado:', error);
      alert('Error al crear empleado');
    }
  };

  const eliminarEmpleado = async (id) => {
    if (window.confirm('¿Eliminar este empleado?')) {
      try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          cargarUsuarios();
          alert('Empleado eliminado');
        }
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
      }
    }
  };

  const handleEditEmpleado = (empleado) => {
    setEditandoEmpleado(empleado);
    setEmpleadoEditForm({
      nombre: empleado.nombre,
      email: empleado.email,
      rol: empleado.rol || 'empleado'
    });
  };

  const actualizarEmpleado = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/usuarios/${editandoEmpleado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empleadoEditForm)
      });
      if (response.ok) {
        alert('Empleado actualizado exitosamente');
        setEditandoEmpleado(null);
        cargarUsuarios();
      } else {
        alert('Error al actualizar empleado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar empleado');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const agregarOrigen = () => {
    if (nuevoOrigen.trim() && !formData.origen.includes(nuevoOrigen.trim())) {
      setFormData({
        ...formData,
        origen: [...formData.origen, nuevoOrigen.trim()]
      });
      setNuevoOrigen('');
    }
  };

  const eliminarOrigen = (origen) => {
    setFormData({
      ...formData,
      origen: formData.origen.filter(o => o !== origen)
    });
  };

  const agregarIngrediente = () => {
    if (nuevoIngrediente.trim() && !formData.ingredientes.includes(nuevoIngrediente.trim())) {
      setFormData({
        ...formData,
        ingredientes: [...formData.ingredientes, nuevoIngrediente.trim()]
      });
      setNuevoIngrediente('');
    }
  };

  const eliminarIngrediente = (ingrediente) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.filter(i => i !== ingrediente)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoriaSeleccionada = categoriasBackend.find(
      c => c.nombre.toLowerCase() === formData.categoria.toLowerCase()
    );

    if (!categoriaSeleccionada) {
      alert('Por favor selecciona una categoría válida');
      return;
    }

    const productoData = {
      nombre: formData.nombre,
      precio: parseFloat(formData.precio),
      categoria: formData.categoria,
      categoriaId: categoriaSeleccionada.id,
      descripcion: formData.descripcion,
      origen: formData.origen.join(', '),
      notasCata: formData.notasCata,
      ingredientes: formData.ingredientes, // Array de ingredientes
      imagen: formData.imagen || '/src/assets/images/default.jpg',
      disponible: true
    };

    console.log('Enviando producto:', productoData);
    console.log('Ingredientes a guardar:', productoData.ingredientes);

    try {
      if (editandoId) {
        await editarProducto(editandoId, productoData);
        alert('Producto actualizado exitosamente');
      } else {
        await agregarProducto(productoData);
        alert('Producto creado exitosamente');
      }
      resetForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto: ' + error.message);
    }
  };

  const obtenerNombreCategoria = (producto) => {
    if (producto.categoriaNombre) {
      return producto.categoriaNombre;
    }
    if (typeof producto.categoria === 'string') {
      const cat = categoriasBackend.find(c => c.nombre.toLowerCase() === producto.categoria);
      return cat?.nombre || producto.categoria;
    }
    return 'Sin categoría';
  };

  const handleEdit = (producto) => {
    setEditandoId(producto.id);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      descripcion: producto.descripcion || '',
      origen: producto.origen ? producto.origen.split(', ') : [],
      notasCata: producto.notasCata || '',
      ingredientes: Array.isArray(producto.ingredientes) ? producto.ingredientes : [],
      imagen: producto.imagen || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditandoId(null);
    setFormData({
      nombre: '',
      precio: '',
      categoria: categoriasBackend[0]?.nombre?.toLowerCase() || '',
      descripcion: '',
      origen: [],
      notasCata: '',
      ingredientes: [],
      imagen: ''
    });
    setNuevoOrigen('');
    setNuevoIngrediente('');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const estadosPedido = {
    pendiente: { label: 'Pendiente', color: '#ff9800', icon: '⏳', bg: 'rgba(255, 152, 0, 0.1)' },
    preparacion: { label: 'En preparación', color: '#2196f3', icon: '👨‍🍳', bg: 'rgba(33, 150, 243, 0.1)' },
    listo: { label: 'Listo para entregar', color: '#4caf50', icon: '✅', bg: 'rgba(76, 175, 80, 0.1)' },
    entregado: { label: 'Entregado', color: '#9e9e9e', icon: '📦', bg: 'rgba(158, 158, 158, 0.1)' }
  };

  const cargarPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const response = await fetch(`${API_URL}/pedidos`);
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
        setPedidosFiltrados(data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const cargarResumenPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos/resumen`);
      if (response.ok) {
        const data = await response.json();
        setResumenPedidos(data);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
  };

  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      if (response.ok) {
        cargarPedidos();
        cargarResumenPedidos();
        alert(`Pedido actualizado a "${estadosPedido[nuevoEstado]?.label || nuevoEstado}"`);
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const verDetallesPedido = async (id) => {
    try {
      console.log('Cargando detalles del pedido:', id);
      const response = await fetch(`${API_URL}/pedidos/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Detalles recibidos:', data);
        setPedidoSeleccionado(data);
        setModalAbierto(true);
      } else {
        console.error('Error al cargar detalles:', response.status);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  useEffect(() => {
    if (filtroEstado === 'todos') {
      setPedidosFiltrados(pedidos);
    } else {
      setPedidosFiltrados(pedidos.filter(p => p.estado === filtroEstado));
    }
  }, [filtroEstado, pedidos]);

  useEffect(() => {
    if (activeTab === 'pedidos') {
      cargarPedidos();
      cargarResumenPedidos();
    }
  }, [activeTab]);

  return (
    <div className={styles.adminPanel}>
      <SessionWarning timeoutMinutes={5} onExtend={() => {
        window.dispatchEvent(new Event('mousemove'));
      }} />
      
      <button className={styles.menuHamburger} onClick={toggleMobileMenu}>
        <span className={styles.hamburgerIcon}>☰</span>
      </button>

      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={toggleMobileMenu}></div>
      )}

      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <h2>The Sushi Room</h2>
          <p>Administración</p>
        </div>

        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>⭐</div>
          <div className={styles.adminDetails}>
            <span className={styles.adminName}>{user?.nombre || 'Administrador'}</span>
            <span className={styles.adminEmail}>{user?.email || 'admin@sushiroom.com'}</span>
            <span className={styles.adminRole}>Administrador</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === 'productos' ? styles.navItemActive : ''}`}
            onClick={() => {
              setActiveTab('productos');
              setMobileMenuOpen(false);
            }}
          >
            <span className={styles.navIcon}>📦</span>
            <span>Productos</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'empleados' ? styles.navItemActive : ''}`}
            onClick={() => {
              setActiveTab('empleados');
              setMobileMenuOpen(false);
            }}
          >
            <span className={styles.navIcon}>👥</span>
            <span>Empleados</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === 'pedidos' ? styles.navItemActive : ''}`}
            onClick={() => {
              setActiveTab('pedidos');
              setMobileMenuOpen(false);
            }}
          >
            <span className={styles.navIcon}>📋</span>
            <span>Pedidos</span>
          </button>
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span className={styles.logoutIcon}>➜</span>
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <div>
            <h1>Panel de Administración</h1>
            <p>Bienvenido, {user?.nombre || 'Administrador'} 👋</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{productos.length}</span>
              <span className={styles.statLabel}>Productos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{usuarios.filter(u => u.rol === 'empleado').length}</span>
              <span className={styles.statLabel}>Empleados</span>
            </div>
          </div>
        </div>

        {/* Sección de Productos */}
        {activeTab === 'productos' && (
          <div className={styles.productosAdmin}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Gestión de Productos</h2>
                <p>Administra tu catálogo de sushi</p>
              </div>
              <button
                className={`${styles.agregarBtn} ${showForm ? styles.btnCancel : ''}`}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancelar' : '+ Agregar Producto'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                  <h3>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                  <div className={styles.formHeaderLine}></div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej: California Roll"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Precio (MXN)</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1"
                      placeholder="Ej: 180"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Categoría</label>
                    <select
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                      required
                    >
                      {categoriasBackend.map(cat => (
                        <option key={cat.id} value={cat.nombre.toLowerCase()}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>URL de Imagen</label>
                    <input
                      type="text"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Descripción del producto..."
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Origen (puedes agregar múltiples)</label>
                    <div className={styles.multiSelectContainer}>
                      <div className={styles.selectWrapper}>
                        <select
                          value={nuevoOrigen}
                          onChange={(e) => setNuevoOrigen(e.target.value)}
                          className={styles.selectInput}
                        >
                          <option value="">Selecciona un país...</option>
                          {paisesOrigen.map(pais => (
                            <option key={pais} value={pais}>{pais}</option>
                          ))}
                        </select>
                        <button type="button" onClick={agregarOrigen} className={styles.addBtn}>
                          + Agregar
                        </button>
                      </div>
                      <div className={styles.tagsContainer}>
                        {formData.origen.map((origen, idx) => (
                          <span key={idx} className={styles.tag}>
                            {origen}
                            <button type="button" onClick={() => eliminarOrigen(origen)} className={styles.tagRemove}>
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Notas de Cata</label>
                    <textarea
                      name="notasCata"
                      value={formData.notasCata}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Sabor, textura, aroma..."
                    />
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Ingredientes (puedes agregar múltiples)</label>
                    <div className={styles.multiSelectContainer}>
                      <div className={styles.selectWrapper}>
                        <select
                          value={nuevoIngrediente}
                          onChange={(e) => setNuevoIngrediente(e.target.value)}
                          className={styles.selectInput}
                        >
                          <option value="">Selecciona un ingrediente...</option>
                          {ingredientesPredeterminados.map(ing => (
                            <option key={ing} value={ing}>{ing}</option>
                          ))}
                        </select>
                        <button type="button" onClick={agregarIngrediente} className={styles.addBtn}>
                          + Agregar
                        </button>
                      </div>
                      <div className={styles.tagsContainer}>
                        {formData.ingredientes.map((ingrediente, idx) => (
                          <span key={idx} className={styles.tag}>
                            {ingrediente}
                            <button type="button" onClick={() => eliminarIngrediente(ingrediente)} className={styles.tagRemove}>
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="O escribe un ingrediente nuevo..."
                        value={nuevoIngrediente}
                        onChange={(e) => setNuevoIngrediente(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && agregarIngrediente()}
                        className={styles.customInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>
                    {editandoId ? 'Actualizar Producto' : 'Guardar Producto'}
                  </button>
                  <button type="button" onClick={resetForm} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className={styles.productosList}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map(producto => (
                      <tr key={producto.id}>
                        <td data-label="ID">#{producto.id}</td>
                        <td data-label="Producto">
                          <div className={styles.productoInfo}>
                            <div className={styles.productoNombre}>
                              <strong>{producto.nombre}</strong>
                              {producto.descripcion && (
                                <small>{producto.descripcion.substring(0, 60)}...</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td data-label="Categoría">
                          <span className={styles.categoriaBadge}>
                            {obtenerNombreCategoria(producto)}
                          </span>
                        </td>
                        <td data-label="Precio">${producto.precio}</td>
                        <td data-label="Acciones">
                          <div className={styles.acciones}>
                            <button
                              onClick={() => handleEdit(producto)}
                              className={styles.editarBtn}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => eliminarProducto(producto.id)}
                              className={styles.eliminarBtn}
                              title="Eliminar"
                            >
                              ✖
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Empleados */}
        {activeTab === 'empleados' && (
          <div className={styles.usuariosSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Gestión de Empleados</h2>
                <p>Administra los empleados del restaurante</p>
              </div>
              <button
                className={`${styles.agregarBtn} ${showUserForm ? styles.btnCancel : ''}`}
                onClick={() => setShowUserForm(!showUserForm)}
              >
                {showUserForm ? 'Cancelar' : '+ Agregar Empleado'}
              </button>
            </div>

            {showUserForm && (
              <form onSubmit={crearEmpleado} className={styles.userForm}>
                <div className={styles.formHeader}>
                  <h3>Nuevo Empleado</h3>
                  <div className={styles.formHeaderLine}></div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Nombre completo</label>
                    <input
                      type="text"
                      value={nuevoEmpleado.nombre}
                      onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={nuevoEmpleado.email}
                      onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })}
                      placeholder="empleado@ejemplo.com"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Contraseña</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={nuevoEmpleado.password}
                        onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, password: e.target.value })}
                        placeholder="******"
                        required
                      />
                      <button
                        type="button"
                        className={styles.togglePasswordBtn}
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>Crear Empleado</button>
                  <button type="button" onClick={() => setShowUserForm(false)} className={styles.cancelBtn}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {editandoEmpleado && (
              <div className={styles.modal} onClick={() => setEditandoEmpleado(null)}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>Editar Empleado</h3>
                    <button className={styles.modalClose} onClick={() => setEditandoEmpleado(null)}>✕</button>
                  </div>
                  <form onSubmit={actualizarEmpleado} className={styles.userForm}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Nombre completo</label>
                        <input
                          type="text"
                          value={empleadoEditForm.nombre}
                          onChange={(e) => setEmpleadoEditForm({...empleadoEditForm, nombre: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={empleadoEditForm.email}
                          onChange={(e) => setEmpleadoEditForm({...empleadoEditForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Rol</label>
                        <select
                          value={empleadoEditForm.rol}
                          onChange={(e) => setEmpleadoEditForm({...empleadoEditForm, rol: e.target.value})}
                        >
                          <option value="empleado">Empleado</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.saveBtn}>Guardar Cambios</button>
                      <button type="button" onClick={() => setEditandoEmpleado(null)} className={styles.cancelBtn}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className={styles.productosList}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.filter(u => u.rol === 'empleado').map(usuario => (
                      <tr key={usuario.id}>
                        <td data-label="ID">#{usuario.id}</td>
                        <td data-label="Nombre">{usuario.nombre}</td>
                        <td data-label="Email">{usuario.email}</td>
                        <td data-label="Rol">
                          <span className={styles.categoriaBadge}>👨‍🍳 Empleado</span>
                        </td>
                        <td data-label="Acciones">
                          <div className={styles.acciones}>
                            <button
                              onClick={() => handleEditEmpleado(usuario)}
                              className={styles.editarBtn}
                              title="Editar"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => eliminarEmpleado(usuario.id)}
                              className={styles.eliminarBtn}
                              title="Eliminar"
                            >
                              ✘
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usuarios.filter(u => u.rol === 'empleado').length === 0 && (
                      <tr>
                        <td colSpan="5" className={styles.emptyTableRow}>
                          No hay empleados registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Sección de Pedidos */}
        {activeTab === 'pedidos' && (
          <div className={styles.pedidosSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Gestión de Pedidos</h2>
                <p>Administra los pedidos de los clientes</p>
              </div>
            </div>

            <div className={styles.resumenContainer}>
              <div className={styles.resumenCard} style={{ background: '#FFF3E0', borderLeft: '4px solid #FF9800' }}>
                <div>
                  <span className={styles.resumenNumero} style={{ color: '#ff6200' }}>{resumenPedidos.pendiente || 0}</span>
                  <span className={styles.resumenLabel}>Pendientes</span>
                </div>
              </div>
              <div className={styles.resumenCard} style={{ background: '#E3F2FD', borderLeft: '4px solid #2196F3' }}>
                <div>
                  <span className={styles.resumenNumero} style={{ color: '#2196F3' }}>{resumenPedidos.preparacion || 0}</span>
                  <span className={styles.resumenLabel}>En preparación</span>
                </div>
              </div>
              <div className={styles.resumenCard} style={{ background: '#E8F5E9', borderLeft: '4px solid #4CAF50' }}>
                <div>
                  <span className={styles.resumenNumero} style={{ color: '#4CAF50' }}>{resumenPedidos.listo || 0}</span>
                  <span className={styles.resumenLabel}>Listos</span>
                </div>
              </div>
              <div className={styles.resumenCard} style={{ background: '#EEEEEE', borderLeft: '4px solid #9E9E9E' }}>
                <div>
                  <span className={styles.resumenNumero} style={{ color: '#757575' }}>{resumenPedidos.entregado || 0}</span>
                  <span className={styles.resumenLabel}>Entregados</span>
                </div>
              </div>
            </div>

            <div className={styles.filtrosContainer}>
              <button
                className={`${styles.filtroBtn} ${filtroEstado === 'todos' ? styles.filtroActivo : ''}`}
                onClick={() => setFiltroEstado('todos')}
              >
                Todos ({resumenPedidos.total || 0})
              </button>
              <button
                className={`${styles.filtroBtn} ${filtroEstado === 'pendiente' ? styles.filtroActivo : ''}`}
                onClick={() => setFiltroEstado('pendiente')}
              >
                Pendientes ({resumenPedidos.pendiente || 0})
              </button>
              <button
                className={`${styles.filtroBtn} ${filtroEstado === 'preparacion' ? styles.filtroActivo : ''}`}
                onClick={() => setFiltroEstado('preparacion')}
              >
                En preparación ({resumenPedidos.preparacion || 0})
              </button>
              <button
                className={`${styles.filtroBtn} ${filtroEstado === 'listo' ? styles.filtroActivo : ''}`}
                onClick={() => setFiltroEstado('listo')}
              >
                Listos ({resumenPedidos.listo || 0})
              </button>
              <button
                className={`${styles.filtroBtn} ${filtroEstado === 'entregado' ? styles.filtroActivo : ''}`}
                onClick={() => setFiltroEstado('entregado')}
              >
                Entregados ({resumenPedidos.entregado || 0})
              </button>
            </div>

            {loadingPedidos ? (
              <div className={styles.loadingState}>Cargando pedidos...</div>
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
                        <div>
                          <span className={styles.pedidoNumero}>Pedido #{pedido.numeroPedido}</span>
                          <span className={styles.pedidoFecha}>
                            {new Date(pedido.fechaPedido).toLocaleString()}
                          </span>
                        </div>
                        <span
                          className={styles.pedidoEstado}
                          style={{
                            background: estadosPedido[pedido.estado]?.color,
                            color: '#FFFFFF'
                          }}
                        >
                          {estadosPedido[pedido.estado]?.label}
                        </span>
                      </div>

                      <div className={styles.pedidoInfo}>
                        <div className={styles.pedidoCliente}>
                          <strong>Cliente:</strong> {pedido.usuario?.nombre || 'Cliente no registrado'}
                        </div>
                        <div className={styles.pedidoTotal}>
                          <strong>Total:</strong> ${pedido.total}
                        </div>
                        <div className={styles.pedidoPago}>
                          <strong>Pago:</strong> {pedido.metodoPago || 'No especificado'}
                        </div>
                      </div>

                      <div className={styles.pedidoAcciones}>
                        <button
                          className={styles.btnDetalles}
                          onClick={() => verDetallesPedido(pedido.id)}
                        >
                          Ver detalles
                        </button>
                        {pedido.estado === 'pendiente' && (
                          <button
                            className={styles.btnPreparar}
                            onClick={() => cambiarEstadoPedido(pedido.id, 'preparacion')}
                          >
                            Iniciar preparación
                          </button>
                        )}
                        {pedido.estado === 'preparacion' && (
                          <button
                            className={styles.btnListo}
                            onClick={() => cambiarEstadoPedido(pedido.id, 'listo')}
                          >
                            Marcar como listo
                          </button>
                        )}
                        {pedido.estado === 'listo' && (
                          <button
                            className={styles.btnEntregar}
                            onClick={() => cambiarEstadoPedido(pedido.id, 'entregado')}
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
          </div>
        )}

        {modalAbierto && pedidoSeleccionado && (
          <div className={styles.modal} onClick={() => setModalAbierto(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Detalles del Pedido #{pedidoSeleccionado.pedido?.numeroPedido || 'Cargando...'}</h3>
                <button className={styles.modalClose} onClick={() => setModalAbierto(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.detallesCliente}>
                  <p><strong>Cliente:</strong> {pedidoSeleccionado.pedido?.comentarios?.split(' - ')[0]?.replace('Cliente: ', '') || 'Cliente'}</p>
                  <p><strong>Fecha:</strong> {new Date(pedidoSeleccionado.pedido?.fechaPedido).toLocaleString()}</p>
                  <p><strong>Método de pago:</strong> {pedidoSeleccionado.pedido?.metodoPago || 'No especificado'}</p>
                  <p><strong>Comentarios:</strong> {pedidoSeleccionado.pedido?.comentarios || 'Sin comentarios'}</p>
                </div>
                <div className={styles.detallesProductos}>
                  <h4>Productos</h4>
                  <table className={styles.detallesTable}>
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 ? (
                        pedidoSeleccionado.detalles.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.nombreProducto}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.precioUnitario}</td>
                            <td>${item.cantidad * item.precioUnitario}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center' }}>No hay productos disponibles</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3"><strong>Total</strong></td>
                        <td><strong>${pedidoSeleccionado.pedido?.total || 0}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;