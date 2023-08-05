import React from 'react';
import cl from './FeatureButton.module.css';
// Кнопка, которая обладает несколько другими стилями. Используется в личном кабинете и в документах.
const FeatureButton = ({children, classname, ...props}) => {
  return (
    <button className={[classname, cl.btn].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default FeatureButton;