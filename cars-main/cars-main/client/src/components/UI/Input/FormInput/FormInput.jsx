import React from 'react';
import cl from './FormInput.module.css';
// Обычный инпут, только с лейблом
// Здесь передается register и error. Register - это функция, которая регистрирует этот инпут для React-hook-form, а error - это параметр который меняет цвет инпута в зависимости от того есть ли в нем ошибки в результате валидации
const FormInput = React.forwardRef(({classname, labelText,register,error,name, ...props},ref) => {
  return (
    <label className={[cl.label,classname,].join(" ")}>{labelText}
      <input ref={ref} {...register} name={name} className={[cl.input, error? cl.error : ''].join(' ')} 
        {...props}>
      </input>
    </label>
  );
})
export default FormInput;