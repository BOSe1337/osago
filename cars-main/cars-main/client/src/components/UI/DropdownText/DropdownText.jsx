import React, { useState } from 'react';
import styles from './DropdownText.module.css';
// Просто менюшка с кнопкой "Выйти" в личном кабинете пользователя
const DropdownText = ({children,text, classname, ...props}) => {
  const [isOpen,setIsOpen] = useState(false);
  const fadeIn = () => {
    setIsOpen(true);
  }
  const fadeOut = () => {
    setIsOpen(false);
  }
  return (
    <div onMouseEnter={fadeIn} onMouseLeave={fadeOut} className={styles.parent}  {...props}>
      <span className={[styles.caption,classname].join(" ")}>{text}</span>
      <div className={[styles.dropdown,isOpen ? styles.dropdownOpen : ""].join(" ")}>
        {children}
      </div>
    </div>
  );
};

export default DropdownText;