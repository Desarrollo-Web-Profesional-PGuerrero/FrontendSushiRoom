import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const heroRef = useRef(null);
  const [showSelector, setShowSelector] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [preferences, setPreferences] = useState({
    tipo: '',
    picante: '',
    favorito: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Efecto de parallax suave al hacer scroll
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
      // Guardar preferencias y redirigir al menú
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      navigate('/menu', { state: { recommendations: true, preferences: newPreferences } });
    }
  };

  const handleStartJourney = () => {
    // Verificar si ya eligió experiencia antes
    const hasExperience = localStorage.getItem('userExperience');
    if (hasExperience) {
      // Si ya eligió, ir directamente al menú
      navigate('/menu');
    } else {
      // Si no, mostrar selector
      setShowSelector(true);
    }
  };

  // Si está mostrando el selector
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
              <span className={styles.selectorIcon}>🎯</span>
              <div>
                <h3>Experiencia Guiada</h3>
                <p>Te guiaremos según tus gustos</p>
              </div>
            </button>
            
            <button 
              className={`${styles.selectorBtn} ${styles.directBtn}`}
              onClick={() => handleExperienceSelect('direct')}
            >
              <span className={styles.selectorIcon}>📋</span>
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

  // Si está mostrando las preguntas guiadas
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

  // Home normal (sin selector)
  return (
    <div className={styles.home}>
      {/* Partículas de fondo */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      <div className={styles.hero}>
        <div className={styles.fondoPlaceholder} ref={heroRef}>
          <div className={styles.fondoOverlay}></div>
        </div>
        
        <div className={styles.overlay}>
          <div className={styles.decorativeLine}></div>
          <div className={styles.decorativeCircle}></div>
          
          <div className={styles.contentWrapper}>
            <span className={styles.welcomeTag}>Bienvenido a</span>
            
            <h1 className={styles.title}>
              <span className={styles.titleWord}>The</span>
              <span className={styles.titleWord}>Sushi</span>
              <span className={styles.titleWord}>Room</span>
            </h1>
            
            <p className={styles.subtitle}>
              Donde cada bocado es una experiencia única
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🍣</span>
                <span>Sushi Artesanal</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✨</span>
                <span>Ingredientes Frescos</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏮</span>
                <span>Ambiente Único</span>
              </div>
            </div>
            
            <button onClick={handleStartJourney} className={styles.btn}>
              <span className={styles.btnText}>Comenzar viaje</span>
              <span className={styles.btnIcon}>→</span>
            </button>
            
            <div className={styles.scrollIndicator}>
              <span className={styles.scrollText}>Descubre más</span>
              <div className={styles.scrollArrow}>↓</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>50+</span>
          <span className={styles.statLabel}>Variedades de Sushi</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>5</span>
          <span className={styles.statLabel}>Años de Experiencia</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>100%</span>
          <span className={styles.statLabel}>Frescura Garantizada</span>
        </div>
      </div>
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