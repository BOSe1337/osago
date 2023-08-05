import React from 'react';
import styles from './AltButton.module.css';
// бело-черная кнопка. Если проще - негатив черно-белой кнопки.
const AltButton = ({children, classname, ...props}) => {
  return (
    <button className={[styles.btn,classname,styles.alt].join(" ")} {...props}>
      {children}
    </button>
  );
  };
export default AltButton;