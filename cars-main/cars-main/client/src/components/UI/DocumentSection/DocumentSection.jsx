import React, {useState, useRef, useEffect} from 'react';
import { FileDrop } from 'react-file-drop';
import Modal from 'react-modal/lib/components/Modal';
import FeatureButton from '../Button/FeatureButton/FeatureButton';
import Document from '../Document/Document';
import styles from './DocumentSection.module.css';
import doc from '../../../images/doc.svg';
import FormInput from '../Input/FormInput/FormInput';
import Button from '../Button/Button';
import { useHttp } from '../../../hooks/http.hook';
// Секция Документов для личного кабинета или админки. Хранит в себе документы определенного пользователя
const DocumentSection = ({id,role}) => {
  const {loading,request,fileRequest,error,clearError} = useHttp();
  const [filename,setFilename] = useState(); // Имя файла. Необходимо чтоб сказать серверу под каким название мы будем сохранять файл
  const [docs,setDocs] = useState([]); // Список всех документов пользователя, а точнее файлов в его папке
  const inputFile = useRef(null); // UseRef используется если мы хотим обратиться к DOM-элементу напрямую. В данном случае этот useRef будет присвоен к скрытому input
                                  // типа "file", чтобы провоцировать его нажатие по нажатию на другой элемент (просто нет других вариантов как иначе попросить клиента выбрать файл на компьютере)
  const [file,setFile] = useState(); // файл, который будет загружен на сервер
  const [NameInputIsOpen,setNameInputIsOpen] = useState(false); // Определяет открыто ли модальное окно с вводом имени файла
  const closeNameInputModal = () => setNameInputIsOpen(false);
  const openFileModal = (file) => {
    setNameInputIsOpen(true);
  };
  // Получить массив всех документов пользователя
  const getDocs = async () => {
    try{
      const imageArray = await request('/api/docs/'+id,'GET');
      setDocs(imageArray);
    }
    catch(e){
      console.log('Не получилось получить массив изображений',e.message);
    }
  }
  // Удалить выбранный документ
  const removeDocument = async (name) => {
    try{
      const query = await request(`/api/docs/delete/${id}/${name}`,'GET');
    }
    catch(e){
      console.log(e.message);
    }
    getDocs();
  }
  // Загрузить новый документ. Query - то то, что будет отправлено на сервер. Таким образом отправляется файл и 2 текстовых переменные - название файла и id пользователя, которому надо его добавить.
  const uploadData = async (event) => {
    let query = new FormData();
    query.append('text',filename);
    query.append('text',id);
    query.append('file',file);
    try{
      const respond = await fileRequest('/api/docs/upload','POST',query);
      getDocs();
    }
    catch(e){
      console.log(e.message);
    }
    setFile(undefined); // В конце убираем файл, чтобы случайно не загрузить тот же файл еще раз
    setNameInputIsOpen(false); // И скрываем модалку с вводом имени
  }
  // Провоцирование клика по скрытому инпуту чтобы появилось окно с выбором файла
  const openFileDialog = (event) => {
    event.preventDefault();
    inputFile.current.click();
  }
  // useEffect с пустым массивом [] в коцне определяет, что это будет вызвано только один раз при первом рендере элемента
  useEffect(() => {
    getDocs();
  },[])
  return (
    <div className='border-t-2 pt-5 border-gray-300 rounded-md'>
    <h4 className='text-left mb-4'>Ваши документы</h4>
    <div className={styles.docs}>
      {/* для каждого документа создается элемент Document, в который передается ссылка на скачивание этого документа, а также изображение, которое этот документ будет содержать */}
      {docs && docs.map (image => <Document key={image} role={role} delDoc={() => removeDocument(image)} href={`http://localhost:5000/api/docs/download/image/${id}/${image}`} img={`http://localhost:5000/api/docs/image/${id}/${image}`} name={image}/>)}
      {/* Это нужно для возможности загружать файлы с помощью перетаскивания на кнопку файла */}
      <FileDrop
        onDrop={(files, event) => {setFile(files[0]);setNameInputIsOpen(true)}}
      >
      <input name={'file'} onChange={(event)=>{setFile(event.target.files[0]); setNameInputIsOpen(true)}} ref={inputFile} id="fileInput" type={"file"} style={{display:"none"}}/>
        <FeatureButton classname={styles.newDoc} onClick={openFileDialog}>
          <img className={styles.icon} src={doc} alt='Иконка добавить новый документ'/><span>Новый документ</span>
        </FeatureButton>
      </FileDrop>
    </div>
    {/* Модалка для ввода имени файла после ввода при нажатии на кнопку отправляет файл */}
    <Modal
        isOpen={NameInputIsOpen}
        onRequestClose={closeNameInputModal}
        overlayClassName='overlay'
        className='modal'
        >
          <div className='flex flex-col gap-5 items-center justify-center'>
          <FormInput value={filename} onChange={e => setFilename(e.target.value)} type={'text'} labelText={'Название файла'} name={'FileName'}/>
          <Button onClick={uploadData}>Принять</Button>
          </div>
      </Modal>        
  </div>
  );
};

export default DocumentSection;