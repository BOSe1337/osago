import React from 'react';
import cl from './FormButton.module.css';

const FormButton = ({children, classname, ...props}) => {
  return (
    <button className={[cl.btn,classname].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default FormButton;