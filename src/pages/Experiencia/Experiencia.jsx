import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Experiencia.module.css';

const Experiencia = () => {
  return (
    <div className={styles.experiencia}>
      <div className={styles.hero}>
        <h1>Experiencia The Sushi Room</h1>
        <p>Descubre nuestra filosofía culinaria</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Nuestra Filosofía</h2>
          <p>
            En The Sushi Room creemos que cada plato es una obra de arte. 
            Combinamos tradición japonesa con ingredientes frescos locales 
            para crear una experiencia única.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Ingredientes Premium</h2>
          <p>
            Seleccionamos cuidadosamente cada ingrediente, desde el salmón noruego 
            hasta el atún rojo del Mediterráneo. La frescura es nuestra prioridad.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Nuestros Chefs</h2>
          <p>
            Nuestros chefs están altamente capacitados en técnicas tradicionales 
            japonesas, con años de experiencia en la preparación de sushi.
          </p>
        </section>

        <Link to="/menu" className={styles.btnMenu}>
          Ver Nuestro Menú
        </Link>
      </div>
    </div>
  );
};

// Asegúrate de que esta línea existe
export default Experiencia;