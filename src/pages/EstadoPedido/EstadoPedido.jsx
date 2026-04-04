import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EstadoPedido.module.css';

const EstadoPedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datoCurioso, setDatoCurioso] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [imagenChef, setImagenChef] = useState('');
  const intervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const isMounted = useRef(true);

  // Estados del pedido
  const estados = {
    pendiente: { label: 'Pendiente', color: '#ff9800', icon: '⏳', paso: 1 },
    preparacion: { label: 'En preparación', color: '#2196f3', icon: '👨‍🍳', paso: 2 },
    listo: { label: 'Listo para entregar', color: '#4caf50', icon: '✅', paso: 3 },
    entregado: { label: 'Entregado', color: '#9e9e9e', icon: '📦', paso: 4 }
  };

  const pasos = [
    { estado: 'pendiente', label: 'Pedido recibido', icon: '⏳' },
    { estado: 'preparacion', label: 'En preparación', icon: '👨‍🍳' },
    { estado: 'listo', label: 'Listo para entregar', icon: '✅' },
    { estado: 'entregado', label: 'Entregado', icon: '📦' }
  ];

  const imagenesChef = [
    "https://tse4.mm.bing.net/th/id/OIP.ZROPqiLCuL-KQc6-warR9AHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
    "https://thumbs.dreamstime.com/b/chef-preparing-sushi-closeup-hands-japanese-food-japanese-making-restaurant-young-serving-traditional-japanese-76596912.jpg",
    "https://thumbs.dreamstime.com/b/cocinero-de-la-mujer-que-llena-los-rollos-de-sushi-japoneses-de-arroz-39640763.jpg",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    "https://img.freepik.com/fotos-premium/primer-plano-chef-japones-preparandose-cocinar-comida-japonesa-hacer-sushi-restaurante-japones-tradicional-tabla-cortar_369024-1440.jpg"
  ];

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
      titulo: "Salsa de soya",
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

  // Cargar pedido desde el backend
  const cargarPedido = useCallback(async () => {
    if (!id || !isMounted.current) return;

    try {
      console.log('Cargando pedido número:', id);
      // El id ya es el número de pedido (ej: "PED-1734567890123")
      const response = await fetch(`http://localhost:8080/api/pedidos/buscar/${id}`);

      if (response.ok) {
        const data = await response.json();
        if (isMounted.current) {
          console.log('Pedido recibido:', data);
          setPedido(data);
          setError(null);
        }
      } else {
        if (isMounted.current) {
          setError('Pedido no encontrado');
        }
      }
    } catch (err) {
      console.error('Error al cargar pedido:', err);
      if (isMounted.current) {
        setError('Error al cargar el pedido');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [id]);

  // Polling para actualizar el estado automáticamente cada 5 segundos
  useEffect(() => {
    isMounted.current = true;

    // Cargar pedido inmediatamente
    cargarPedido();

    // Configurar polling
    pollingIntervalRef.current = setInterval(() => {
      if (isMounted.current) {
        cargarPedido();
      }
    }, 5000);

    return () => {
      isMounted.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [cargarPedido]);

  // Datos curiosos - se inicializa solo una vez
  useEffect(() => {
    const randomDatoIndex = Math.floor(Math.random() * datosCuriosos.length);
    setDatoCurioso(datosCuriosos[randomDatoIndex]);

    const randomImagenIndex = Math.floor(Math.random() * imagenesChef.length);
    setImagenChef(imagenesChef[randomImagenIndex]);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const cambiarDatoCurioso = useCallback(() => {
    setAnimating(true);

    let nuevoDato;
    do {
      const randomIndex = Math.floor(Math.random() * datosCuriosos.length);
      nuevoDato = datosCuriosos[randomIndex];
    } while (datoCurioso && nuevoDato.id === datoCurioso.id && datosCuriosos.length > 1);

    setDatoCurioso(nuevoDato);

    let nuevaImagen;
    do {
      const randomIndex = Math.floor(Math.random() * imagenesChef.length);
      nuevaImagen = imagenesChef[randomIndex];
    } while (nuevaImagen === imagenChef && imagenesChef.length > 1);

    setImagenChef(nuevaImagen);

    setTimeout(() => {
      setAnimating(false);
    }, 500);
  }, [datoCurioso, imagenChef, datosCuriosos, imagenesChef]);

  // Timer para cambiar datos curiosos automáticamente
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      cambiarDatoCurioso();
    }, 15000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cambiarDatoCurioso]);

  if (loading) {
    return (
      <div className={styles.loading}>
        Cargando información del pedido...
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className={styles.error}>
        <h2>Pedido no encontrado</h2>
        <p>No pudimos encontrar tu pedido. Verifica el número de seguimiento.</p>
        <button onClick={() => navigate('/')} className={styles.button}>
          Volver al inicio
        </button>
      </div>
    );
  }

  const pedidoData = pedido.pedido;
  const detalles = pedido.detalles || [];
  const estadoActual = pedidoData?.estado || 'pendiente';

  const pasoActual = estados[estadoActual]?.paso || 1;

  const fechaFormateada = pedidoData?.fechaPedido
    ? new Date(pedidoData.fechaPedido).toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'short'
    })
    : 'Fecha no disponible';

  const getTiempoEstimado = () => {
    switch (estadoActual) {
      case 'pendiente':
        return 'Tiempo estimado: 5-10 minutos';
      case 'preparacion':
        return 'Tiempo estimado: 15-20 minutos';
      case 'listo':
        return 'Tu pedido está listo para entregar';
      case 'entregado':
        return '¡Disfruta tu sushi!';
      default:
        return 'Procesando tu pedido...';
    }
  };

  const getMetodoPagoTexto = () => {
    const metodo = pedidoData?.metodoPago;
    switch (metodo) {
      case 'efectivo':
        return 'Efectivo';
      case 'tarjeta':
        return 'Tarjeta';
      case 'transferencia':
        return 'Transferencia';
      default:
        return metodo || 'No especificado';
    }
  };

  const getNombreCliente = () => {
    const comentarios = pedidoData?.comentarios || '';
    const match = comentarios.match(/Cliente: ([^-]+)/);
    return match ? match[1].trim() : 'Cliente';
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
        <div className={styles.infoPedido}>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Número de pedido:</span>
              <span className={styles.value}>#{pedidoData?.numeroPedido}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Cliente:</span>
              <span className={styles.value}>{getNombreCliente()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Fecha:</span>
              <span className={styles.value}>{fechaFormateada}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Total:</span>
              <span className={styles.value}>${pedidoData?.total?.toFixed(2) || 0} MXN</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Método de pago:</span>
              <span className={styles.value}>{getMetodoPagoTexto()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Tiempo estimado:</span>
              <span className={styles.tiempoEstimado}>{getTiempoEstimado()}</span>
            </div>
          </div>
        </div>

        <div className={styles.timelineSection}>
          <h2>Proceso de tu pedido</h2>
          <div className={styles.timeline}>
            {pasos.map((paso, index) => {
              const isCompleted = index + 1 <= pasoActual;
              const isActive = index + 1 === pasoActual;

              return (
                <div key={index} className={styles.timelineStep}>
                  <div className={`${styles.stepCircle} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}>
                    <span className={styles.stepIcon}>{paso.icon}</span>
                  </div>
                  <div className={styles.stepLabel}>{paso.label}</div>
                  {index < pasos.length - 1 && (
                    <div className={`${styles.stepLine} ${isCompleted ? styles.lineCompleted : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

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

            <div className={`${styles.curiosoContainer} ${animating ? styles.curiosoContainerAnimating : ''}`}>
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
                <span>Mientras esperas, aprende más sobre sushi</span>
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

        <div className={styles.resumenSection}>
          <h2>Resumen de tu pedido</h2>
          <div className={styles.itemsList}>
            {detalles.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemCantidad}>{item.cantidad}x</span>
                  <span className={styles.itemNombre}>{item.nombreProducto}</span>
                </div>
                <span className={styles.itemPrecio}>
                  ${(item.precioUnitario * item.cantidad).toFixed(2)} MXN
                </span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <span className={styles.totalMonto}>${pedidoData?.total?.toFixed(2) || 0} MXN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoPedido;