import React from 'react';
import cl from './FormArea.module.css';

const FormArea = React.forwardRef(({register, classname, labelText, name, ...props},ref) => {
  return (
    <label className={[cl.label,classname].join(" ")}>{labelText}
      <textarea ref={ref} {...register} name={name} className={cl.area} 
        {...props}>
      </textarea>
    </label>
  );
  });
export default FormArea;