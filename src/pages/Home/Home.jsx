import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const heroRef = useRef(null);
  const [showSelector, setShowSelector] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showContactModal, setShowContactModal] = useState(false); // Nuevo estado para el modal
  const [preferences, setPreferences] = useState({
    tipo: '',
    picante: '',
    favorito: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `scale(${1 + scrolled * 0.0005})`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const questions = {
    1: {
      question: "🍣 ¿Qué tipo de sushi prefieres?",
      options: [
        { value: "nigiri", label: "Nigiri", icon: "🍣", desc: "Arroz con pescado encima" },
        { value: "maki", label: "Maki", icon: "🌯", desc: "Rollos enrollados" },
        { value: "sashimi", label: "Sashimi", icon: "🐟", desc: "Solo pescado fresco" },
        { value: "todos", label: "Todos", icon: "🎌", desc: "Me gusta variar" }
      ]
    },
    2: {
      question: "🌶️ ¿Qué tan picante te gusta?",
      options: [
        { value: "suave", label: "Suave", icon: "😊", desc: "Sin picante" },
        { value: "medio", label: "Medio", icon: "😋", desc: "Un toque picante" },
        { value: "fuerte", label: "Fuerte", icon: "🔥", desc: "Me encanta el picante" }
      ]
    },
    3: {
      question: "🐟 ¿Cuál es tu proteína favorita?",
      options: [
        { value: "salmón", label: "Salmón", icon: "🐟", desc: "Clásico y suave" },
        { value: "atun", label: "Atún", icon: "🎣", desc: "Intenso y delicioso" },
        { value: "camaron", label: "Camarón", icon: "🦐", desc: "Crujiente y suave" },
        { value: "vegetariano", label: "Vegetariano", icon: "🥑", desc: "Opción sin pescado" }
      ]
    }
  };

  const handleExperienceSelect = (experience) => {
    localStorage.setItem('userExperience', experience);

    if (experience === 'guided') {
      setShowSelector(false);
      setShowQuestions(true);
    } else {
      navigate('/menu');
    }
  };

  const handlePreferenceSelect = (step, value) => {
    const field = step === 1 ? 'tipo' : step === 2 ? 'picante' : 'favorito';
    const newPreferences = { ...preferences, [field]: value };
    setPreferences(newPreferences);

    if (step < 3) {
      setCurrentStep(step + 1);
    } else {
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      navigate('/menu', { state: { recommendations: true, preferences: newPreferences } });
    }
  };

  const handleStartJourney = () => {
    const hasExperience = localStorage.getItem('userExperience');
    if (hasExperience) {
      navigate('/menu');
    } else {
      setShowSelector(true);
    }
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const closeModal = () => {
    setShowContactModal(false);
  };

  if (showSelector) {
    return (
      <div className={styles.selectorContainer}>
        <div className={styles.selectorCard}>
          <h1 className={styles.selectorTitle}>¿Cómo prefieres explorar?</h1>

          <div className={styles.selectorOptions}>
            <button
              className={`${styles.selectorBtn} ${styles.guidedBtn}`}
              onClick={() => handleExperienceSelect('guided')}
            >
              <span className={styles.selectorIcon}>⚙</span>
              <div>
                <h3>Experiencia Guiada</h3>
                <p>Te guiaremos según tus gustos</p>
              </div>
            </button>

            <button
              className={`${styles.selectorBtn} ${styles.directBtn}`}
              onClick={() => handleExperienceSelect('direct')}
            >
              <span className={styles.selectorIcon}>🗒</span>
              <div>
                <h3>Menú Directo</h3>
                <p>Explora todo nuestro catálogo</p>
              </div>
            </button>
          </div>

          <button
            className={styles.closeSelector}
            onClick={() => setShowSelector(false)}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (showQuestions) {
    const question = questions[currentStep];
    return (
      <div className={styles.questionsContainer}>
        <div className={styles.questionsCard}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <p className={styles.stepText}>Paso {currentStep} de 3</p>

          <h2 className={styles.questionText}>{question.question}</h2>

          <div className={styles.optionsGrid}>
            {question.options.map((option) => (
              <button
                key={option.value}
                className={styles.optionCard}
                onClick={() => handlePreferenceSelect(currentStep, option.value)}
              >
                <span className={styles.optionIcon}>{option.icon}</span>
                <div>
                  <div className={styles.optionLabel}>{option.label}</div>
                  <div className={styles.optionDesc}>{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            className={styles.skipQuestions}
            onClick={() => navigate('/menu')}
          >
            Saltar y ver menú completo →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {/* Partículas de fondo */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      {/* Modal de Contacto */}
      {showContactModal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>×</button>
            <div className={styles.modalIcon}>🗨</div>
            <h2 className={styles.modalTitle}>Contáctanos</h2>
            <p className={styles.modalSubtitle}>Estamos aquí para ayudarte</p>

            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✆</span>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>Teléfono / WhatsApp</span>
                  <a href="tel:+521234567890" className={styles.contactValue}>+52 (123) 456-7890</a>
                  <span className={styles.contactHint}>Llámanos o escribe por WhatsApp</span>
                </div>
              </div>

              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉︎</span>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>Correo Electrónico</span>
                  <a href="mailto:info@sushisroom.com" className={styles.contactValue}>info@sushisroom.com</a>
                  <span className={styles.contactHint}>Respuesta en menos de 24h</span>
                </div>
              </div>

              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>⏱</span>
                <div className={styles.contactDetails}>
                  <span className={styles.contactLabel}>Horario de Atención</span>
                  <span className={styles.contactValue}>Lunes a Domingo: 12:00 - 22:00</span>
                  <span className={styles.contactHint}>Servicio a domicilio hasta las 21:30</span>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <a href="https://wa.me/521234567890" target="_blank" rel="noopener noreferrer" className={styles.modalBtnWhatsapp}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.fondoPlaceholder} ref={heroRef}>
          <div className={styles.fondoOverlay}></div>
        </div>

        <div className={styles.overlay}>
          <div className={styles.contentWrapper}>
            <span className={styles.welcomeTag}>Bienvenido a</span>

            <h1 className={styles.title}>
              <span className={styles.titleWord}>The</span>
              <span className={styles.titleWord}>Sushi</span>
              <span className={styles.titleWord}>Room</span>
            </h1>

            <div className={styles.subtitleWrapper}>
              <p className={styles.subtitleJp}>心を込めて</p>
              <p className={styles.subtitleEn}>"Preparado con el corazón y dedicación"</p>
            </div>
            
            <button onClick={handleStartJourney} className={styles.btn}>
              <span className={styles.btnText}>Comenzar viaje</span>
              <span className={styles.btnIcon}>➔</span>
            </button>

            <div className={styles.scrollIndicator}>
              <span className={styles.scrollText}>Descubre más</span>
              <div className={styles.scrollArrow}>↓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Servicios */}
      <div className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
          <p className={styles.sectionSubtitle}>Ofrecemos una experiencia completa para los amantes del sushi</p>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🍣</div>
              <h3>Sushi a Domicilio</h3>
              <p>Disfruta de nuestro sushi en la comodidad de tu hogar con entrega rápida y segura</p>
              <ul className={styles.serviceList}>
                <li>✓ Entrega en menos de 45 min</li>
                <li>✓ Empaque especializado</li>
                <li>✓ Cobertura en toda la ciudad</li>
              </ul>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🍱</div>
              <h3>Eventos y Catering</h3>
              <p>Lleva la experiencia The Sushi Room a tu evento especial</p>
              <ul className={styles.serviceList}>
                <li>✓ Bodas y celebraciones</li>
                <li>✓ Eventos corporativos</li>
                <li>✓ Menús personalizados</li>
              </ul>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>👨‍🍳</div>
              <h3>Clases de Sushi</h3>
              <p>Aprende a preparar sushi con nuestros chefs expertos</p>
              <ul className={styles.serviceList}>
                <li>✓ Clases para principiantes</li>
                <li>✓ Talleres avanzados</li>
                <li>✓ Experiencias en grupo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Por qué elegirnos */}
      <div className={styles.whyUsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Por qué elegir The Sushi Room?</h2>
          <p className={styles.sectionSubtitle}>Calidad, tradición y pasión en cada platillo</p>

          <div className={styles.whyUsGrid}>
            <div className={styles.whyUsItem}>
              <div className={styles.whyUsIcon}>🐟</div>
              <h3>Pescado Fresco</h3>
              <p>Producto fresco diariamente, seleccionado de las mejores pescaderías</p>
            </div>

            <div className={styles.whyUsItem}>
              <div className={styles.whyUsIcon}>👨‍🍳</div>
              <h3>Chefs Expertos</h3>
              <p>Más de 10 años de experiencia en cocina japonesa tradicional</p>
            </div>

            <div className={styles.whyUsItem}>
              <div className={styles.whyUsIcon}>🌾</div>
              <h3>Arroz Premium</h3>
              <p>Arroz de grano corto importado de Japón</p>
            </div>

            <div className={styles.whyUsItem}>
              <div className={styles.whyUsIcon}>🧼</div>
              <h3>Máxima Higiene</h3>
              <p>Certificados de calidad y protocolos estrictos de limpieza</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Testimonios */}
      <div className={styles.testimonialsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
          <p className={styles.sectionSubtitle}>Experiencias reales de nuestros comensales</p>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>★★★★★</div>
              <p className={styles.testimonialText}>"El mejor sushi que he probado en la ciudad. Ingredientes frescos y un servicio excepcional. ¡Volveré sin duda!"</p>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorName}>María González</span>
                <span className={styles.authorDate}>Cliente frecuente</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>★★★★★</div>
              <p className={styles.testimonialText}>"La experiencia guiada fue increíble. Me recomendaron platos según mis gustos y descubrí nuevos sabores que ahora son mis favoritos."</p>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorName}>Carlos Rodríguez</span>
                <span className={styles.authorDate}>Primera vez</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>★★★★★</div>
              <p className={styles.testimonialText}>"Contratamos el servicio de catering para nuestra boda y fue todo un éxito. Todos nuestros invitados quedaron encantados."</p>
              <div className={styles.testimonialAuthor}>
                <span className={styles.authorName}>Ana y Luis</span>
                <span className={styles.authorDate}>Evento especial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Call to Action */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>¿Listo para una experiencia única?</h2>
          <p>Reserva tu mesa o haz tu pedido a domicilio</p>
          <div className={styles.ctaButtons}>
            <button onClick={() => navigate('/menu')} className={styles.ctaPrimary}>
              Ver Menú
            </button>
            <button onClick={handleContactClick} className={styles.ctaSecondary}>
              Contacto
            </button>
          </div>
        </div>
      </div>

      {/* Reset Section */}
      <div className={styles.resetSection}>
        <button
          className={styles.resetExperienceBtn}
          onClick={() => {
            localStorage.removeItem('userExperience');
            localStorage.removeItem('userPreferences');
            window.location.reload();
          }}
        >
          Cambiar mi experiencia
        </button>
      </div>
    </div>
  );
};

export default Home;