import React from 'react';
import styles from './AltButtonGreen.module.css';
// Кнопка добавить водителя на осаго
const AltButtonGreen = ({children, classname, ...props}) => {
  return (
    <button className={[styles.btn,classname,styles.alt].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default AltButtonGreen;