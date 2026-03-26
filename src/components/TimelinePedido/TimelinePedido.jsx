import React from 'react';
import styles from './TimelinePedido.module.css';

const TimelinePedido = ({ pasos, estadoActual }) => {
  // Encontrar el índice del paso actual
  const pasoActualIndex = pasos.findIndex(paso => paso.id === estadoActual);
  
  return (
    <div className={styles.timeline}>
      {pasos.map((paso, index) => {
        const isCompleted = index <= pasoActualIndex;
        const isCurrent = paso.id === estadoActual;
        
        return (
          <div 
            key={paso.id} 
            className={`${styles.paso} ${isCompleted ? styles.completado : ''} ${isCurrent ? styles.actual : ''}`}
          >
            <div className={styles.marcador}>
              {isCompleted ? (
                <span className={styles.checkmark}>✓</span>
              ) : (
                <span className={styles.numero}>{index + 1}</span>
              )}
            </div>
            <div className={styles.contenido}>
              <h4 className={styles.titulo}>{paso.nombre}</h4>
              <p className={styles.descripcion}>{paso.descripcion}</p>
            </div>
            {index < pasos.length - 1 && (
              <div className={`${styles.linea} ${isCompleted ? styles.lineaCompletada : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimelinePedido;