import React from 'react';
import styles from './AltButtonTransparent.module.css';
// Полупрозрачная кнопка на главной странице снизу в услугах ("Заказать консультацию" и "заказать техосмотр")
const AltButtonTransparent = ({children, classname, ...props}) => {
  return (
    <button className={[styles.btn,classname,styles.alt].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default AltButtonTransparent;