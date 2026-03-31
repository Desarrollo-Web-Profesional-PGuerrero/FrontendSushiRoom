import React, { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import styles from './ProductosAdmin.module.css';

const ProductosAdmin = () => {
  const { productos, agregarProducto, editarProducto, eliminarProducto, toggleDisponibilidad } = useAdmin();
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
    { value: 'nigiri', label: 'Nigiri' },
    { value: 'roll', label: 'Roll' },
    { value: 'sashimi', label: 'Sashimi' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productoData = {
      ...formData,
      precio: parseFloat(formData.precio),
      ingredientes: formData.ingredientes.split(',').map(i => i.trim()),
      imagen: formData.imagen || '/src/assets/images/default.jpg'
    };

    if (editandoId) {
      editarProducto(editandoId, productoData);
    } else {
      agregarProducto(productoData);
    }

    resetForm();
  };

  const handleEdit = (producto) => {
    setEditandoId(producto.id);
    setFormData({
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      disponible: producto.disponible,
      descripcion: producto.descripcion,
      origen: producto.origen,
      notasCata: producto.notasCata,
      ingredientes: producto.ingredientes.join(', '),
      imagen: producto.imagen
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
    <div className={styles.productosAdmin}>
      <div className={styles.header}>
        <h2>Gestión de Productos</h2>
        <button 
          className={styles.agregarBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Agregar Producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{editandoId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio (MXN) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0"
                step="1"
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
                placeholder="/src/assets/images/producto.jpg"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Origen</label>
              <input
                type="text"
                name="origen"
                value={formData.origen}
                onChange={handleInputChange}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Notas de Cata</label>
              <textarea
                name="notasCata"
                value={formData.notasCata}
                onChange={handleInputChange}
                rows="2"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label>Ingredientes (separados por comas)</label>
              <textarea
                name="ingredientes"
                value={formData.ingredientes}
                onChange={handleInputChange}
                placeholder="Ingrediente 1, Ingrediente 2, Ingrediente 3"
                rows="2"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  name="disponible"
                  checked={formData.disponible}
                  onChange={handleInputChange}
                />
                Producto disponible
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>
              {editandoId ? 'Actualizar' : 'Guardar'} Producto
            </button>
            <button type="button" onClick={resetForm} className={styles.cancelBtn}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.productosList}>
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
                <td>{producto.id}</td>
                <td>
                  <div className={styles.productoInfo}>
                    <strong>{producto.nombre}</strong>
                    <small>{producto.descripcion.substring(0, 50)}...</small>
                  </div>
                </td>
                <td>{categorias.find(c => c.value === producto.categoria)?.label || producto.categoria}</td>
                <td>${producto.precio}</td>
                <td>
                  <button
                    className={`${styles.estadoBtn} ${producto.disponible ? styles.disponible : styles.noDisponible}`}
                    onClick={() => toggleDisponibilidad(producto.id)}
                  >
                    {producto.disponible ? 'Disponible' : 'No disponible'}
                  </button>
                </td>
                <td>
                  <div className={styles.acciones}>
                    <button
                      onClick={() => handleEdit(producto)}
                      className={styles.editarBtn}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      className={styles.eliminarBtn}
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
  );
};

export default ProductosAdmin;