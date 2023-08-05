import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useHttp } from '../../hooks/http.hook';
import { useAuth } from '../../hooks/auth.hook';
import Modal from 'react-modal/lib/components/Modal';

import FormButton from '../../components/UI/Button/FormButton/FormButton';
import DropdownText  from '../../components/UI/DropdownText/DropdownText';
import OsagoForm from '../../components/UI/Forms/Osago/OsagoForm';
import FeatureButton from '../../components/UI/Button/FeatureButton/FeatureButton';
import edit from '../../images/edit.svg';
import DocumentSection from '../../components/UI/DocumentSection/DocumentSection';
import DocsButton from '../../components/UI/Button/DocsButton/DocsButton';
import ConsultForm from '../../components/UI/Forms/ConsultForm/ConsultForm';
import ToForm from '../../components/UI/Forms/ToForm/ToForm';
import Button from '../../components/UI/Button/Button';
import AltButton from '../../components/UI/Button/AltButton/AltButton';

import styles from './admin.module.css';
const Admin = () => {
  // Данные текущего пользователя
  const [name,setName] = useState('');
  const [userEmail,setUserEmail] = useState('');
  const [role,setRole] = useState();
  const [id,setId] = useState(0);

  const {logout} = useAuth(); // Функция выхода из системы

  const [rows,setRows] = useState([]); // строки в нашей таблице
  const [exportData,setExportData] = useState([]); // данные для экспорта
  const [rowElements, setRowElements] = useState([]); // Строковые элементы, которые отображаются непосредственно в таблице

  // Модалки
  const [OsagoIsOpen, setOsagoIsOpen] = useState(false); 
  const [ConsultIsOpen, setConsultIsOpen] = useState(false);
  const [ToIsOpen, setToIsOpen] = useState(false);
  const [DocsIsOpen,setDocsIsOpen] = useState(false);
  const [isDeleteOpen,setIsDeleteOpen] = useState(false);
  const [isServiceOpen,setIsServiceOpen] = useState(false);
  const closeDocsModal = () => setDocsIsOpen(false);

  
  const {loading,request,fileRequest,error,clearError} = useHttp(); // Все запросы к серверу через этот хук
  const [currentClient, setCurrentClient] = useState(); // ID КЛИЕНТА .Выбранный клиент в таблице (Админка)
  const [selectedUserId,setSelectedUserId] = useState(); // ID ПОЛЬЗОВАТЕЛЯ, который был выбран в таблице (Админка)
  const [mode,setMode] = useState(2); // Режим обработки данных клиента. 1 - Добавление, 2 - Изменение.
  const clearClient = () => { // Вызывается при нажатии на кнопку "Добавить" чтобы очистить клиента, переставить Mode - Режим обработки данных. В случае если Mode = 2, то идет изменение имеющихся данных
    // А при mode =1 - добавление. И вызывается модалка спрашивающая какую услугу нужно этому клиенту. (И показывает затем соответствующую модалку с нужной формой)
    setMode(1);
    setCurrentClient(undefined);
    setIsServiceOpen(true);
  }
  const displayDocs = async (event) => { // По факту она просто вытаскивает из таблицы email клиента и получает значение id пользователя с таким email, а затем при изменении selectedUserId
                                         // уже вытаскиваются документы пользователя с сервера по этому id
    event.stopPropagation();
    let clientEmail = event.target.closest('tr');
    clientEmail = clientEmail.querySelector(':nth-child(6)').innerHTML;
    try{
      const userId = await request('/api/users/getidbyemail/'+clientEmail,'GET');
      setSelectedUserId(userId.id);
    }
    catch(e){
      console.log(e.message);
    }
  }
  const setClientId = (event) => { // При нажатии на строку в таблице получаем id клиента в этой строке, чтобы дальше заполнить форму данными этого пользователя для просмотра/редактирования
    event.stopPropagation();
    setMode(2);
    const row = event.target.closest('tr');
    const id = row.querySelector('td').innerHTML;
    setCurrentClient(id);
  }
  const removeClient = async () => { // Запрос на сервер для удаления клиента и обновления страницы
    try{
      console.log(await request('/api/clients/remove/'+currentClient,'GET'));
      setIsDeleteOpen(false);
      getTableData();
    }
    catch(e){
      console.log('Не удалось удалить клиента ' + e.message)
    }
  }
  useEffect(() => {                   // Вот здесь откарываются документы с выбранными selectedUserId
    if(selectedUserId!=undefined)
      setDocsIsOpen(true);
  },[selectedUserId])
  const exportHeaders = [             // Заголовки для нашего экспорта (верхняя строка)
    {label:'Фамилия',key:'lastname'},
    {label:'Имя',key:'firstname'},
    {label:'Отчество',key:'secondname'},
    {label:'Номер',key:'phone'},
    {label:'Email',key:'email'},
    {label:'Услуга',key:'type'},
    {label:'Дата',key:'date'},
  ]
  useEffect(() => {                   // Получение данных пользователя при запуске страницы
    const auth = localStorage.getItem('auth');
    setName(JSON.parse(auth).name);
    setRole(JSON.parse(auth).role);
    setUserEmail(JSON.parse(auth).email);
    setId(JSON.parse(auth).id);
  },[])

  const displayData = (cell) => {      // Тут меняется выбранный клиент и открывается форма в зависимости от того какие данные ввел пользователь (и ставится режим изменения)
    setMode(2);
    const row = cell.closest('tr');
    const id = row.querySelector('td').innerHTML;
    setCurrentClient(id);
    const type = row.querySelector(':nth-child(8)').innerHTML;
    switch (type){
      case ('Осаго'):{setOsagoIsOpen(true);break;}
      case ('Консульт'):{setConsultIsOpen(true);break;}
      default:{setToIsOpen(true);break;}
    }
  }
  const getExport = async () => {       // Получение данных с сервера для экспорта
    try{
      await request('/api/clients/export','GET').then(res => {
        setExportData(res);
      });
    } catch(e) {
      console.log('Произошла ошибка при экспорте',e.message );
    }
  }
  const getUserData = async () => {     // Получение данных пользователя, если у нас не админ, а просто пользователь
    let data = await request('/api/clients/data/'+userEmail,'GET');
    setMode(2);
    setCurrentClient(data.id);
    switch(data.type){
      case ('Осаго'):{setOsagoIsOpen(true);break;}
      case ('Техосмотр'):{setToIsOpen(true);break;}
      default :{setConsultIsOpen(true);break;}
    }
  }
  useEffect(() => {                   // Role у нас либо 0(Админ), либо 1(Пользователь). Условие тут чтобы при первом запуске пока еще ничего не инициализировалось нам не выдавало ошибку 
    if(role!=undefined){
        getTableData();
    }
  },[role])
  const closeToModal = () => {        // Здесь и дальше у нас идет проверка чтобы данные таблицы прогружались только если мы Админ
    setToIsOpen(false);
    if(!role)
      getTableData();
  }
  const closeConsultModal = () => {
    setConsultIsOpen(false);
    if(!role)
      getTableData();
  }
  const closeOsagoModal = () => {
    setOsagoIsOpen(false);
    if(!role)
      getTableData();
  }
  const getTableData = async () => {     // Получение данных с сервера и занесение их в массив строк нашей таблицы
    let data = await request('/api/clients/view','GET');
    let rows = [];
    data.forEach(row => {
      rows.push({
        id:row.id,
        fio:row.lastname+' ' + row.firstname+' ' +row.secondname,
        model:row.mark? row.mark + ' ' + row.model:row.mark,
        number:row.number,
        phone:row.phone,
        email:row.email,
        type: row.type,
        price:row.price
      });
    });
    setRows(rows);
  }
  useEffect(() => {                     // При изменении rows (Массива клиентов, полученного от сервера) изменяются элементы для отображения в таблице
    rowElements.splice(0,rowElements.length);
    for(let i = 0; i < rows.length;i++){
      rowElements.push(
        <tr className={styles.tableRow} key={rows[i].id} onClick={e => displayData(e.target)}>
          <td className={styles.tableCell} style={{display:'none'}}>{rows[i].id}</td>
          <td className={styles.tableCell}>{rows[i].fio}</td>
          <td className={styles.tableCell}>{rows[i].model}</td>
          <td className={styles.tableCell}>{rows[i].number}</td>
          <td className={styles.tableCell}>{rows[i].phone}</td>
          <td className={styles.tableCell}>{rows[i].email}</td>
          <td className={styles.tableCell}>{rows[i].price}</td>
          <td className={styles.tableCell}>{rows[i].type}</td>
          <DocsButton delAction={(e)=>{setClientId(e);setIsDeleteOpen(true)}} docAction={displayDocs} classname={styles.docBtn}/>
        </tr>
      )
    }
    getExport();
  },[rows])
  return (
    <div className='container'>
      <div className={styles.inner}>
        <h1 className={styles.title}>{!role ? 'Клиенты' : 'Личный кабинет'}</h1>
        <nav className={styles.nav}>
          <Link className={styles.homeLink} to="/">Вернуться на главную</Link>
          <DropdownText classname={styles.adminName} text={name}>
            <Link className={styles.logoutLink} to="/login" onClick={logout}>
              Выйти
            </Link>
          </DropdownText>
        </nav>
        {!role
        ?
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHead}>
                    <tr className={styles.tableRow}>
                      <th className={styles.tableHeading} style={{display:'none'}}>id</th>
                      <th className={styles.tableHeading}>ФИО</th>
                      <th className={styles.tableHeading}>Модель</th>
                      <th className={styles.tableHeading}>Номер</th>
                      <th className={styles.tableHeading}>Номер телефона</th>
                      <th className={styles.tableHeading}>Email</th>
                      <th className={styles.tableHeading}>Цена</th>
                      <th className={styles.tableHeading}>Тип заявки</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {rowElements}
                  </tbody>
                </table>
                <div className={styles.buttonGroup}>
                  <div className={styles.defaultBtns}>
                    <FormButton onClick={clearClient} classname={styles.addBtn}>Добавить</FormButton>
                  </div>
                  <CSVLink separator=';' data={exportData} headers={exportHeaders}>
                    <FormButton classname={styles.expBtn}>Экспорт</FormButton>
                  </CSVLink>
                </div>
              </div>
        :
        <div className={styles.features}>
          <FeatureButton onClick={getUserData}><img src={edit}/><span>Ваши данные</span></FeatureButton>
          <DocumentSection role={role} id={id}/>
        </div>
        }
      </div>
      {/* Модалки. Сначала формы, затем Документы пользователя (если открыть их за админа), окно подтверждения удаления клиента и выбора услуги для клиента (если создавать от админа) */}
      <Modal
        isOpen={OsagoIsOpen}
        onRequestClose={closeOsagoModal}
        overlayClassName='overlay'
        className='modal'
        >
          <OsagoForm dataId={currentClient} mode={mode} closeModalAction = {closeOsagoModal}/>
      </Modal>
      <Modal
        isOpen={ConsultIsOpen}
        onRequestClose={closeConsultModal}
        overlayClassName='overlay'
        className='modal'
        >
          <ConsultForm dataId={currentClient} mode={mode} closeModalAction = {closeConsultModal}/>
      </Modal>      
      <Modal
        isOpen={ToIsOpen}
        onRequestClose={closeToModal}
        overlayClassName='overlay'
        className='modal'
        >
          <ToForm dataId={currentClient} mode={mode} closeModalAction = {closeToModal}/>
      </Modal>
      <Modal
        isOpen={DocsIsOpen}
        onRequestClose={closeDocsModal}
        overlayClassName='overlay'
        className='modal'
        >
          <DocumentSection id={selectedUserId}/>
      </Modal>
      <Modal
        isOpen={isDeleteOpen}
        onRequestClose={()=> setIsDeleteOpen(false)}
        overlayClassName='overlay'
        className='modal'
        >
          <div>
            <h4 className='mb-5'>ВНИМАНИЕ</h4>
            <p className='text-center mb-5'>Вы уверены, что хотите удалить этого клиента?</p>
            <div className='flex gap-5 justify-center'>
            <Button onClick={removeClient}>Да</Button><AltButton onClick={() => setIsDeleteOpen(false)}>Нет</AltButton>
            </div>
          </div>
        </Modal>
      <Modal
        isOpen={isServiceOpen}
        onRequestClose={()=> setIsServiceOpen(false)}
        overlayClassName='overlay'
        className='modal'
      >
        <div className='flex flex-col gap-5'>
          <h4>ВЫБЕРИТЕ ОПЦИЮ</h4>
          <div className='flex gap-5'>
          <Button onClick={()=>{setIsServiceOpen(false); setOsagoIsOpen(true)}}>Осаго</Button>
          <Button onClick={()=>{setIsServiceOpen(false); setConsultIsOpen(true)}}>Консультация</Button>
          <Button onClick={()=>{setIsServiceOpen(false); setToIsOpen(true)}}>Техосмотр</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;