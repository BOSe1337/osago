import React from 'react';
import cl from './Input.module.css';

const Input = ({children, classname, ...props}) => {
  return (
    <input  
      className={[cl.input,classname].join(" ")} 
      {...props}>
    </input>
  );
  };
export default Input;