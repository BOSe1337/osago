import React from 'react';
import cl from './ButtonGreen.module.css';
// Кнопка заказать/сохранить на Осаго
const ButtonGreen = ({children, classname, ...props}) => {
  return (
    <button className={[cl.btn,classname].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default ButtonGreen;