import React, { useEffect, useState } from 'react';
import cl from './Document.module.css';
import downoladImg from '../../../images/export.svg';
import pdf from '../../../images/pdf.png';
// Экземпляр одного документа для отображения в DocumentSection
const Document = ({role, href, img, classname,name,delDoc, ...props}) => {
  const [image, setImage] = useState();
  useEffect(() => {
    // В зависимости от расширения файла, если у нас PDF, то картинка не сможет нормально выводиться. Тогда мы ставим вместо миниатюры документа картинку "PDF" 
    if(img!=undefined){
      let ext = img.lastIndexOf('.')+1;
      ext = img.substring(ext);
      if(ext=='pdf'){
        setImage(pdf);
      } else setImage(img);
    }
  },[])

  return (
    <div className={[cl.doc,classname].join(" ")} {...props}>
      <img className={cl.img} src={image} alt={name} />
      {/* Если мы администратор, то появляется кнопка удаления документа (крестик) */}
      {!role && <div className={cl.delBtn} onClick={(event) => {event.stopPropagation(); delDoc();}}>
          <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M12.45 37.65 10.35 35.55 21.9 24 10.35 12.45 12.45 10.35 24 21.9 35.55 10.35 37.65 12.45 26.1 24 37.65 35.55 35.55 37.65 24 26.1Z"/>
          </svg>
        </div>
        }
      <a href={href} download><span className={cl.name}>{name}<img className={cl.downoladImg} src={downoladImg} alt={'Скачать документ'}/></span></a>
    </div>
  );
  };
export default Document;