import React from 'react';
import styles from './DocsButton.module.css';
import delIcon from '../../../../images/delete.svg';
import docIcon from '../../../../images/admin-doc.svg';
// Кнопки, которые выезжают справа от строки в админке (одна из них удаление клиента, а вторая - просмотр документов)
const DocsButton = ({classname, delAction, docAction, ...props}) => {
  return (
    <td className={[styles.btnGroup,,classname].join(" ")} {...props}>
      <div className={[styles.btn,styles.delBtn].join(' ')} onClick={delAction}>
        <img className={styles.icon} src={delIcon}/>
      </div>
      <div className={styles.btn} onClick={docAction}>
        <img className={styles.icon} src={docIcon}/>
      </div>
    </td>
  );
};

export default DocsButton;