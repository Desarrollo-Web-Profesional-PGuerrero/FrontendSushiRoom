// src/pages/EstadoPedido/EstadoPedido.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePedido } from '../../hooks/usePedido';
import TimelinePedido from '../../components/TimelinePedido/TimelinePedido';
import styles from './EstadoPedido.module.css';

const EstadoPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pedidoActivo, loading, obtenerPedido, pasos } = usePedido();
  
  // Estado para los datos curiosos
  const [datoCurioso, setDatoCurioso] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [imagenChef, setImagenChef] = useState('');
  const intervalRef = useRef(null);

  // Lista de imágenes del chef preparando sushi
  const imagenesChef = [
    "https://tse4.mm.bing.net/th/id/OIP.ZROPqiLCuL-KQc6-warR9AHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://thumbs.dreamstime.com/b/chef-preparing-sushi-closeup-hands-japanese-food-japanese-making-restaurant-young-serving-traditional-japanese-76596912.jpg",
    "https://thumbs.dreamstime.com/b/cocinero-de-la-mujer-que-llena-los-rollos-de-sushi-japoneses-de-arroz-39640763.jpg",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    "https://img.freepik.com/fotos-premium/primer-plano-chef-japones-preparandose-cocinar-comida-japonesa-hacer-sushi-restaurante-japones-tradicional-tabla-cortar_369024-1440.jpg"
  ];

  // Lista de datos curiosos sobre sushi
  const datosCuriosos = [
    {
      id: 1,
      titulo: "Origen del sushi",
      texto: "El sushi no se originó en Japón, sino en el sudeste asiático como método de conservación del pescado en arroz fermentado.",
      emoji: "🇯🇵",
      color: "#ff6b35"
    },
    {
      id: 2,
      titulo: "Wasabi real",
      texto: "La mayoría del wasabi que se sirve en restaurantes fuera de Japón es en realidad rábano picante teñido de verde. El wasabi auténtico es muy caro y difícil de cultivar.",
      emoji: "🌱",
      color: "#4caf50"
    },
    {
      id: 3,
      titulo: "Significado de 'Sushi'",
      texto: "La palabra 'sushi' no significa 'pescado crudo'. En realidad, se refiere al arroz avinagrado. 'Su' significa vinagre y 'shi' viene de meshi (arroz).",
      emoji: "🍚",
      color: "#ff9800"
    },
    {
      id: 4,
      titulo: "Sushi en Japón",
      texto: "En Japón, el sushi tradicionalmente se come con las manos, no con palillos. El nigiri está diseñado para ser comido con los dedos.",
      emoji: "👐",
      color: "#9c27b0"
    },
    {
      id: 5,
      titulo: "Beneficios del sushi",
      texto: "El sushi es rico en omega-3, proteínas y vitaminas. El alga nori contiene más vitamina C que las naranjas.",
      emoji: "💪",
      color: "#2196f3"
    },
    {
      id: 6,
      titulo: "Jengibre encurtido",
      texto: "El jengibre (gari) se come entre diferentes tipos de sushi para limpiar el paladar, no junto con el sushi.",
      emoji: "🫚",
      color: "#ffc107"
    },
    {
      id: 7,
      titulo: "Sushi más caro",
      texto: "El sushi más caro del mundo se sirve en Filipinas, cubierto con oro de 24 quilates y diamantes. Cuesta alrededor de $2,700 USD por pieza.",
      emoji: "💎",
      color: "#ffd700"
    },
    {
      id: 8,
      titulo: "Récord mundial",
      texto: "El récord Guinness por el sushi más grande pesaba más de 3,000 kg y midió 2.5 metros de largo.",
      emoji: "🏆",
      color: "#e91e63"
    },
    {
      id: 9,
      titulo: "Sushi vegetariano",
      texto: "El kappa maki (rollo de pepino) es uno de los sushis vegetarianos más populares. 'Kappa' significa pepino en japonés.",
      emoji: "🥒",
      color: "#8bc34a"
    },
    {
      id: 10,
      titulo: "Soy sauce",
      texto: "Al mojar el sushi en salsa de soya, se debe mojar el pescado, no el arroz, para que no se deshaga.",
      emoji: "🥢",
      color: "#795548"
    },
    {
      id: 11,
      titulo: "Tiempo de preparación",
      texto: "Un chef de sushi profesional (itamae) necesita al menos 10 años de entrenamiento para dominar el arte de preparar sushi.",
      emoji: "👨‍🍳",
      color: "#ff5722"
    },
    {
      id: 12,
      titulo: "Sushi en el espacio",
      texto: "En 2018, se envió sushi al espacio para que los astronautas japoneses pudieran disfrutar de su comida favorita en la Estación Espacial Internacional.",
      emoji: "🚀",
      color: "#3f51b5"
    }
  ];

  // Función para cambiar a un dato curioso aleatorio y también la imagen
  const cambiarDatoCurioso = useCallback(() => {
    setAnimating(true);
    
    // Seleccionar un dato aleatorio diferente al actual
    let nuevoDato;
    do {
      const randomIndex = Math.floor(Math.random() * datosCuriosos.length);
      nuevoDato = datosCuriosos[randomIndex];
    } while (datoCurioso && nuevoDato.id === datoCurioso.id && datosCuriosos.length > 1);
    
    setDatoCurioso(nuevoDato);
    
    // Cambiar también la imagen del chef por una diferente
    let nuevaImagen;
    do {
      const randomIndex = Math.floor(Math.random() * imagenesChef.length);
      nuevaImagen = imagenesChef[randomIndex];
    } while (nuevaImagen === imagenChef && imagenesChef.length > 1);
    
    setImagenChef(nuevaImagen);
    
    // Quitar animación después de 0.5 segundos
    setTimeout(() => {
      setAnimating(false);
    }, 500);
  }, [datoCurioso, imagenChef]);

  // Cargar pedido SOLO UNA VEZ al montar el componente
  useEffect(() => {
    const cargarPedido = async () => {
      if (id) {
        console.log('Cargando pedido ID:', id);
        const pedido = await obtenerPedido(parseInt(id));
        if (!pedido) {
          console.log('Pedido no encontrado, redirigiendo');
          navigate('/');
        }
      }
    };
    
    cargarPedido();
  }, [id, obtenerPedido, navigate]);

  // Inicializar datos curiosos y imagen SOLO UNA VEZ
  useEffect(() => {
    // Seleccionar un dato aleatorio inicial
    const randomDatoIndex = Math.floor(Math.random() * datosCuriosos.length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDatoCurioso(datosCuriosos[randomDatoIndex]);
    
    // Seleccionar una imagen aleatoria inicial
    const randomImagenIndex = Math.floor(Math.random() * imagenesChef.length);
    setImagenChef(imagenesChef[randomImagenIndex]);
    
    // Configurar intervalo para cambiar dato e imagen cada 15 segundos
    intervalRef.current = setInterval(() => {
      cambiarDatoCurioso();
    }, 15000);
    
    // Limpiar intervalo al desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Array vacío para que se ejecute solo una vez

  if (loading) {
    return (
      <div className={styles.loading}>
        Cargando información del pedido...
      </div>
    );
  }

  if (!pedidoActivo) {
    return (
      <div className={styles.error}>
        <h2>Pedido no encontrado</h2>
        <button onClick={() => navigate('/')} className={styles.button}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const fechaFormateada = new Date(pedidoActivo.fecha).toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  // Calcular tiempo estimado basado en el estado
  const getTiempoEstimado = () => {
    switch(pedidoActivo.estado) {
      case 'confirmado':
        return '⏳ Tiempo estimado: 5-10 minutos';
      case 'preparacion':
        return '🍣 Tiempo estimado: 15-20 minutos';
      case 'listo':
        return '✅ Tu pedido está listo para entregar';
      case 'en_camino':
        return '🚚 Tu pedido está en camino';
      case 'entregado':
        return '🎉 ¡Disfruta tu sushi!';
      default:
        return '⏳ Procesando tu pedido...';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          ← Volver
        </button>
        <h1 className={styles.title}>Estado de tu pedido</h1>
      </div>

      <div className={styles.content}>
        {/* Tarjeta de información del pedido */}
        <div className={styles.infoPedido}>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Número de pedido:</span>
              <span className={styles.value}>#{pedidoActivo.id}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>{fechaFormateada}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Total:</span>
              <span className={styles.value}>${pedidoActivo.total.toFixed(2)} MXN</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Método de pago:</span>
              <span className={styles.value}>
                {pedidoActivo.metodoPago === 'efectivo' ? '💵 Efectivo' : 
                 pedidoActivo.metodoPago === 'tarjeta' ? '💳 Tarjeta' : '🏦 Transferencia'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Tiempo estimado:</span>
              <span className={styles.tiempoEstimado}>{getTiempoEstimado()}</span>
            </div>
          </div>
        </div>

        {/* Timeline del pedido */}
        <div className={styles.timelineSection}>
          <h2>Proceso de tu pedido</h2>
          <TimelinePedido 
            pasos={pasos} 
            estadoActual={pedidoActivo.estado}
          />
        </div>

        {/* SECCIÓN DE DATOS CURIOSOS CON IMAGEN DEL CHEF - DATO ENCIMA DE LA IMAGEN */}
        <div className={styles.curiousSection}>
          <div className={styles.curiousContainer}>
            <div className={styles.curiousHeader}>
              <span className={styles.curiousIcon}>🤔</span>
              <h2 className={styles.curiousTitle}>¿Sabías que...?</h2>
              <button 
                className={styles.curiousRefresh}
                onClick={cambiarDatoCurioso}
                aria-label="Ver otro dato curioso"
              >
                🔄
              </button>
            </div>
            
            {/* Contenedor con imagen y dato curioso superpuesto */}
            <div className={`${styles.curiosoContainer} ${animating ? styles.curiosoContainerAnimating : ''}`}>
              {/* Imagen de fondo del chef */}
              {imagenChef && (
                <div className={styles.chefImageWrapper}>
                  <img 
                    src={imagenChef}
                    alt="Chef preparando sushi artesanal"
                    className={styles.chefBackgroundImage}
                  />
                  <div className={styles.chefOverlayDark}></div>
                </div>
              )}
              
              {/* Dato curioso encima de la imagen */}
              {datoCurioso && (
                <div className={styles.datoSuperpuesto}>
                  <div className={styles.datoCard}>
                    <div 
                      className={styles.datoColorBar} 
                      style={{ backgroundColor: datoCurioso.color }}
                    ></div>
                    <div className={styles.datoContent}>
                      <div className={styles.datoEmoji}>{datoCurioso.emoji}</div>
                      <div className={styles.datoTextWrapper}>
                        <h3 className={styles.datoTitle}>{datoCurioso.titulo}</h3>
                        <p className={styles.datoText}>{datoCurioso.texto}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.curiousFooter}>
              <div className={styles.curiousMessage}>
                <span>📖 Mientras esperas, aprende más sobre sushi</span>
              </div>
              <button 
                className={styles.curiousNextBtn}
                onClick={cambiarDatoCurioso}
              >
                <span>Siguiente dato</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className={styles.resumenSection}>
          <h2>Resumen de tu pedido</h2>
          <div className={styles.itemsList}>
            {pedidoActivo.items.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCantidad}>{item.cantidad}x</span>
                  <span className={styles.itemNombre}>{item.nombre}</span>
                </div>
                <span className={styles.itemPrecio}>
                  ${(item.precio * item.cantidad).toFixed(2)} MXN
                </span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <span className={styles.totalMonto}>${pedidoActivo.total.toFixed(2)} MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoPedido;