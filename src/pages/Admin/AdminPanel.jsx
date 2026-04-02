import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const { logout, productos, agregarProducto, editarProducto, eliminarProducto, toggleDisponibilidad } = useAdmin();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    categoria: 'roll',
    disponible: true,
    descripcion: '',
    origen: '',
    notasCata: '',
    ingredientes: '',
    imagen: ''
  });

  const categorias = [
  { value: 'clasicos', label: 'Clásicos' },
  { value: 'especialidades', label: 'Especialidades' },
  { value: 'vegetariano', label: 'Vegetariano' },
  { value: 'bebidas', label: 'Bebidas' }
];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('🚀 Formulario enviado');
  console.log('📝 Datos del formulario:', formData);
  
  const productoData = {
    ...formData,
    precio: parseFloat(formData.precio),
    ingredientes: formData.ingredientes.split(',').map(i => i.trim()),
    imagen: formData.imagen || '/src/assets/images/default.jpg'
  };
  
  console.log('📦 Producto a guardar:', productoData);

  try {
    if (editandoId) {
      console.log('✏️ Editando producto:', editandoId);
      await editarProducto(editandoId, productoData);
    } else {
      console.log('➕ Agregando nuevo producto');
      await agregarProducto(productoData);
    }
    console.log('✅ Producto guardado exitosamente');
    resetForm();
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
  }
};

  const handleEdit = (producto) => {
    setEditandoId(producto.id);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      disponible: producto.disponible,
      descripcion: producto.descripcion || '',
      origen: producto.origen || '',
      notasCata: producto.notasCata || '',
      ingredientes: producto.ingredientes ? producto.ingredientes.join(', ') : '',
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
      categoria: 'roll',
      disponible: true,
      descripcion: '',
      origen: '',
      notasCata: '',
      ingredientes: '',
      imagen: ''
    });
  };

  return (
    <div className={styles.adminPanel}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🍣</div>
          <h2>The Sushi Room</h2>
          <p>Administración</p>
        </div>
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={styles.navIcon}>📦</span>
            Productos
          </button>
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <span className={styles.logoutIcon}>🚪</span>
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.content}>
        <div className={styles.contentHeader}>
          <div>
            <h1>Panel de Administración</h1>
            <p>Gestiona el contenido de tu restaurante</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{productos.length}</span>
              <span className={styles.statLabel}>Productos</span>
            </div>
          </div>
        </div>

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

          {/* Formulario */}
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
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
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

                <div className={styles.formGroup}>
                  <label>Origen</label>
                  <input
                    type="text"
                    name="origen"
                    value={formData.origen}
                    onChange={handleInputChange}
                    placeholder="Ej: Japón, Noruega..."
                  />
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
                  <label>Ingredientes (separados por comas)</label>
                  <textarea
                    name="ingredientes"
                    value={formData.ingredientes}
                    onChange={handleInputChange}
                    placeholder="Arroz, salmón, aguacate, pepino"
                    rows="2"
                  />
                </div>

                <div className={styles.formGroupCheckbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="disponible"
                      checked={formData.disponible}
                      onChange={handleInputChange}
                    />
                    <span>Producto disponible</span>
                  </label>
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

          {/* Tabla de productos */}
          <div className={styles.productosList}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(producto => (
                    <tr key={producto.id} className={!producto.disponible ? styles.inactivo : ''}>
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
                          {categorias.find(c => c.value === producto.categoria)?.label || producto.categoria}
                        </span>
                      </td>
                      <td data-label="Precio" className={styles.precioCell}>
                        ${producto.precio}
                      </td>
                      <td data-label="Estado">
                        <button
                          className={`${styles.estadoBtn} ${producto.disponible ? styles.disponible : styles.noDisponible}`}
                          onClick={() => toggleDisponibilidad(producto.id)}
                        >
                          {producto.disponible ? 'Disponible' : 'No disponible'}
                        </button>
                      </td>
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
                            🗑️
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
      </main>
    </div>
  );
};

export default AdminPanel;