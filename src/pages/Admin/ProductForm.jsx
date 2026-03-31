import React, { useState, useEffect } from 'react';
import { crearProducto, actualizarProducto } from '../../services/productService';
import styles from './ProductForm.module.css';

const ProductForm = ({ producto, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    origen: '',
    notasCata: '',
    ingredientes: '',
    categoria: 'roll',
    imagen: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditing = !!producto;

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        origen: producto.origen,
        notasCata: producto.notasCata,
        ingredientes: producto.ingredientes.join(', '),
        categoria: producto.categoria,
        imagen: producto.imagen
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        ingredientes: formData.ingredientes.split(',').map(i => i.trim()),
        imagen: formData.imagen || '/src/assets/images/default.jpg'
      };

      if (isEditing) {
        await actualizarProducto(producto.id, productoData);
      } else {
        await crearProducto(productoData);
      }
      onGuardar();
    } catch (err) {
      setError('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <button onClick={onCancelar} className={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="precio">Precio (MXN) *</label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="nigiri">Nigiri</option>
                <option value="roll">Roll</option>
                <option value="sashimi">Sashimi</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="imagen">URL de la imagen</label>
              <input
                type="text"
                id="imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="/src/assets/images/producto.jpg"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className={styles.formGroupFull}>
              <label htmlFor="origen">Origen</label>
              <textarea
                id="origen"
                name="origen"
                value={formData.origen}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label htmlFor="notasCata">Notas de cata</label>
              <textarea
                id="notasCata"
                name="notasCata"
                value={formData.notasCata}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <div className={styles.formGroupFull}>
              <label htmlFor="ingredientes">Ingredientes (separados por comas)</label>
              <textarea
                id="ingredientes"
                name="ingredientes"
                value={formData.ingredientes}
                onChange={handleChange}
                rows="2"
                placeholder="Ej: Salmón fresco, Arroz, Vinagre de arroz"
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" onClick={onCancelar} className={styles.btnCancelar}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.btnGuardar}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;