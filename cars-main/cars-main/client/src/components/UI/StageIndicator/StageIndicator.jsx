import React from 'react';
import styles from './StageIndicator.module.css';
// Индикатор того, на какой стадии находится сейчас клиент в форме осаго и какие стадии ему еще предстоят.
const StageIndicator = ({stage,...props}) => {
  const stages = ['Автомобиль', 'Водители', 'Собственник', 'Расчёт'];
  return (
    <div className={styles.container}>
      {stages.map(((item,index) => (
        <div key={index} className={styles.stage}>
          {/* Если текущая стадия формы равна порядковому номеру этой надписи, то добавим туда стиль action, который добавит полоску снизу */}
          <span className={stage===index ? styles.active:''}>
          {item}
          </span>
          </div>
      )))}
    </div>
  );
};

export default StageIndicator;