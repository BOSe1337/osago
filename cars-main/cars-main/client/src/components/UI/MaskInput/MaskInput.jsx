import React from 'react';
import { Controller } from 'react-hook-form';
import MaskedInput from 'react-text-mask';
import cl from './MaskInput.module.css';
// Работает всё на базе react-text-mask. Controller тут нужен чтобы проводить валидацию данных в форме.(Тут используется filter, который указывается в параметрах при вызове этого компонента,
// он нужен для валидации на соответствие указанному нами шаблону). 
// mask также сообщает в каком формате будут данные вводиться, только в отличие от filter он не позволяет физически клиенту ввести данные не так как надо
  const MaskInput = ({children,labelText, name, Required, error, control, labelClass, classname, ...props}) => {
    return (
      <label className={[cl.label,labelClass].join(" ")}>
        {labelText?labelText:''}
          <Controller
          control={control}
          name={name}
          rules={{required:Required, pattern:props.filter}}
          render={
            ({field:{onChange,value}}) => (
              <MaskedInput 
                onChange={onChange}
                value={value}
                name={name}
                mask={props.mask} 
                className={[classname, cl.input,error?cl.error:''].join(" ")} 
                {...props}
              />
            )
          }
          />
      </label>
    );
    };
export default MaskInput;