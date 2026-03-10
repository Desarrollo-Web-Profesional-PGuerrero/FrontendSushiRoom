import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductoDetalle.module.css';

// Datos mock con la información requerida
const productosMock = [
  { 
    id: 1, 
    nombre: 'Salmón Nigiri', 
    precio: 105, 
    imagen: '/src/assets/images/salmon.jpg',
    descripcion: 'Delicioso corte de salmón fresco sobre arroz avinagrado, preparado al momento.',
    origen: 'Salmón proveniente de aguas frías de Noruega, criado de manera sostenible.',
    notasCata: 'Textura suave y mantecosa, con un sabor limpio y fresco. El arroz está perfectamente sazonado con vinagre de arroz japonés.',
    ingredientes: ['Salmón fresco', 'Arroz para sushi', 'Vinagre de arroz', 'Azúcar', 'Sal', 'Alga nori (opcional)']
  },
  { 
    id: 2, 
    nombre: 'Atún Nigiri', 
    precio: 115, 
    imagen: '/src/assets/images/tuna.jpg',
    descripcion: 'Corte de atún rojo de primera calidad sobre una base de arroz sazonado.',
    origen: 'Atún rojo capturado en el Mediterráneo, seleccionado por su calidad y frescura.',
    notasCata: 'Sabor intenso y característico, con una textura firme pero tierna. Cada bocado se deshace en la boca.',
    ingredientes: ['Atún rojo', 'Arroz para sushi', 'Vinagre de arroz', 'Wasabi', 'Jengibre encurtido']
  },
  { 
    id: 3, 
    nombre: 'Roll California', 
    precio: 125, 
    imagen: '/src/assets/images/california.png',
    descripcion: 'El clásico rollo californiano con pepino, aguacate y cangrejo, envuelto en ajonjolí.',
    origen: 'Receta inspirada en la fusión japonesa-californiana, adaptada con ingredientes locales frescos.',
    notasCata: 'Textura crujiente por el ajonjolí tostado, combinado con la suavidad del aguacate y la frescura del pepino.',
    ingredientes: ['Alga nori', 'Arroz', 'Pepino', 'Aguacate', 'Surimi', 'Ajonjolí tostado']
  },
  { 
    id: 4, 
    nombre: 'Roll Spicy Tuna', 
    precio: 130, 
    imagen: '/src/assets/images/spicy.jpg',
    descripcion: 'Rollo de atún picante con un toque de mayonesa japonesa y salsa sriracha.',
    origen: 'Especialidad de la casa, creada para los amantes del picante con ingredientes frescos.',
    notasCata: 'El picante equilibrado resalta el sabor del atún, creando una experiencia intensa y sabrosa.',
    ingredientes: ['Atún', 'Arroz', 'Salsa picante', 'Mayonesa japonesa', 'Cebollín', 'Alga nori']
  },
  { 
    id: 5, 
    nombre: 'Sashimi Salmón', 
    precio: 120, 
    imagen: '/src/assets/images/sashimi.png',
    descripcion: 'Finas láminas de salmón fresco servidas con daikon y salsa de soya.',
    origen: 'Preparación tradicional japonesa que resalta la calidad del pescado, con salmón noruego.',
    notasCata: 'La frescura del salmón es la protagonista, con una textura aterciopelada que se derrite en el paladar.',
    ingredientes: ['Salmón fresco', 'Daikon rallado', 'Salsa de soya', 'Wasabi', 'Jengibre']
  },
  { 
    id: 6, 
    nombre: 'Ebi Roll', 
    precio: 110, 
    imagen: '/src/assets/images/ebi.jpg',
    descripcion: 'Rollo de camarón tempurizado con aguacate y salsa de anguila.',
    origen: 'Fusión de técnicas japonesas con camarón fresco del Golfo de México.',
    notasCata: 'El contraste entre el camarón crujiente y la suavidad del aguacate es espectacular, con un toque dulce de la salsa.',
    ingredientes: ['Camarón', 'Tempura', 'Aguacate', 'Salsa de anguila', 'Arroz', 'Alga nori']
  }
];

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      const productoEncontrado = productosMock.find(p => p.id === parseInt(id));
      setProducto(productoEncontrado || null);
      setLoading(false);
    }, 100);
  }, [id]);

  const handleAgregarCarrito = () => {
    // Aquí iría la lógica para agregar al carrito
    console.log('Agregando al carrito:', {
      ...producto,
      cantidad
    });
    // Mostrar mensaje de éxito o redirigir
    alert(`${producto.nombre} agregado al carrito (${cantidad} unidad(es))`);
  };

  if (loading) {
    return <div className={styles.loading}>Cargando producto...</div>;
  }

  if (!producto) {
    return (
      <div className={styles.notFound}>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/menu')} className={styles.backButton}>
          Volver al menú
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        ← Volver
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          <img src={producto.imagen} alt={producto.nombre} className={styles.image} />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <p className={styles.precio}>${producto.precio} MXN</p>

          <div className={styles.section}>
            <h3>Descripción</h3>
            <p>{producto.descripcion}</p>
          </div>

          <div className={styles.section}>
            <h3>Origen</h3>
            <p>{producto.origen}</p>
          </div>

          <div className={styles.section}>
            <h3>Notas de cata</h3>
            <p>{producto.notasCata}</p>
          </div>

          <div className={styles.section}>
            <h3>Ingredientes</h3>
            <ul className={styles.ingredientesList}>
              {producto.ingredientes.map((ingrediente, index) => (
                <li key={index}>{ingrediente}</li>
              ))}
            </ul>
          </div>

          <div className={styles.carritoSection}>
            <div className={styles.cantidadControl}>
              <label htmlFor="cantidad">Cantidad:</label>
              <div className={styles.cantidadInput}>
                <button 
                  onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  className={styles.cantidadBtn}
                >-</button>
                <span>{cantidad}</span>
                <button 
                  onClick={() => setCantidad(prev => prev + 1)}
                  className={styles.cantidadBtn}
                >+</button>
              </div>
            </div>

            <button 
              onClick={handleAgregarCarrito}
              className={styles.agregarBtn}
            >
              Agregar al carrito - ${producto.precio * cantidad} MXN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;