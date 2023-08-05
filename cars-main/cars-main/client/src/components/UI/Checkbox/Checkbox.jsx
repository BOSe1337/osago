import React, { useEffect, useState } from 'react';
import cl from './Checkbox.module.css';
import Select from 'react-select';

const Checkbox = ({children, classname, checked, onchange, name, options, ...props}) => {
  return (
    <label className={[cl.label,classname].join(" ")}>
      <input onChange={onchange} checked={checked? checked : false} type={'checkbox'} className={cl.checkbox}></input>
      {children}
    </label>
  );
  };
export default Checkbox;