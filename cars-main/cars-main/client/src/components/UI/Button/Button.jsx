import React from 'react';
import cl from './Button.module.css';
// Обычная кнопка, используется по всему приложению
const Button = ({children, classname, ...props}) => {
  return (
    <button className={[cl.btn,classname].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default Button;