import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MaskInput from '../../components/UI/MaskInput/MaskInput';
import Button from '../../components/UI/Button/Button';
import AltButton from '../../components/UI/Button/AltButton/AltButton';
import { AuthContext } from '../../context';
import AltButtonTransparent from '../../components/UI/Button/AltButton/AltButtonTransparent/AltButtonTransparent';
import cascoBg from '../../images/casco-bg.jpg';
import toBg from '../../images/to-bg.jpg';
import ToForm from '../../components/UI/Forms/ToForm/ToForm';
import Modal from 'react-modal/lib/components/Modal';
import ConsultForm from '../../components/UI/Forms/ConsultForm/ConsultForm';
import styles from './main.module.css';
import { useForm } from 'react-hook-form';
import {useAuth} from '../../hooks/auth.hook.js';
// import Loader from '../components/UI/Loader/Loader';
Modal.setAppElement('#root');
const Main = () => {
  const [name,setName] = useState(''); //Имя пользователя для отображения возле кнопки "выйти"
  const navigate = useNavigate(); // Хук для перехода на другой роут (ссылка без ссылки крч, которая позволяет еще данные туда передать)
  const {isAuth,logout} = useAuth(); // UseAuth - самописный хук для авторизации и для выхода из пользователя. Создает в памяти браузера данные о текущей сессии (JWT токен авторизации, роль пользователя (админ или нет), id пользователя, его имя и email)
  const {register,handleSubmit, control, watch, formState: { errors}} = useForm(); //React-hook-form NPM пакет. Нужен для валидации наших форм
  const [ToIsOpen, setToIsOpen] = useState(false); //Переменная, которая хранит в себе значение открыто ли конкретное модальное окно
  const [ConsultIsOpen, setConsultIsOpen] = useState(false); // то же самое для другой модалки
  const openToModal = () => setToIsOpen(true);
  const closeToModal = () => setToIsOpen(false);
  const openConsultModal = () => setConsultIsOpen(true);
  const closeConsultModal = () => setConsultIsOpen(false);
  const onSubmit = data => { //Перейти на форму и передать туда значение введенного номера
    navigate('/auto',{state:{regNumber:data}});
  }
  useEffect(() => { //Получить имя, которое отобразится справа вверху
    const Name = localStorage.getItem('auth')?localStorage.getItem('auth'):JSON.stringify({name:''});
    setName(JSON.parse(Name).name);
  },[])
  return (
    <div>
      <div className={styles.banner}>
        <div className='container'>
          <div className={styles.inner}>
            <div className={styles.topline}>
              {isAuth //Для авторизованных пользователей одни кнопки, для неавторизованных - другие
              ?
              <div className={styles.nav}>
                <Link className={styles.username} to="/admin">{name}</Link>
                <AltButton onClick={logout} classname='alt'>Выйти</AltButton>
              </div>
              :
              <div className={styles.nav}>
                <AltButton onClick={openConsultModal}>Бесплатная консультация</AltButton>
                <Link to="/login">
                  <Button>Войти</Button>
                </Link>
              </div>
              }
            </div>
            <div className={styles.content}>
              <div className={styles.textContent}>
                <h1 className={styles.title}>Получите своё<br />предложение</h1>
                <h2 className={styles.desc}>Узнайте насколько дешево<br />вы можете получить страховку</h2>
              </div>
              <form className={styles.action} onSubmit={handleSubmit(onSubmit)}>
                {/* MaskInput - это элемент, который как-бы принуждает пользователя вводить данные в формате, который заложил программист. error, control тут от React-Hook-Form.
                mask и filter - это регулярное выражение, которое говорит в каком формате вообще данные принимать. filter нужен для работы React-hook-form, т.к. там немного отличается формат Регулярного выражения. */}
                <MaskInput error={errors.RegNumber} Required={true} name={'RegNumber'} control={control} labelClass={styles.label} mask={[/[а-яА-Я]/,' ',/\d/,/\d/,/\d/,' ',/[а-яА-Я]/,/[а-яА-Я]/,' ',/\d/,/\d/]} classname={styles.input} placeholder='А 000 АА 00' filter={/[а-яА-Я][' ']\d{3}[' ][а-яА-Я]{2}[' ']\d{2}/i}/>
                <div className={styles.actionControls}>
                <span className={styles.rus}>RUS</span>
                <Button classname={styles.btn}>
                  Рассчитать
                </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Здесь верстка 2 блоков услуг внизу страницы. При нажатии на кнопки появляются модальные окна с формами (ConsultForm и ToForm) */}
      <div className={styles.services}>
        <div className={styles.service}>
          <img src={cascoBg} alt="Каско фон"/>
          <div className={styles.container}>
            <div className={styles.service__inner}>
              <h2 className={styles.service__title}>Каско</h2>
              <h3 className={styles.service__desc}>Узнайте как вы можете <br />сэкономить до 25% на страховании</h3>
              <AltButtonTransparent onClick={openConsultModal}>Заказать консультацию</AltButtonTransparent>
              <Modal // Те самые модалки, про которые была речь в начале. В данных примерах они просто показывают формы
                  isOpen={ConsultIsOpen}
                  onRequestClose={closeConsultModal}
                  overlayClassName='overlay'
                  className='modal'
                >
                  <ConsultForm mode={1} closeModalAction={closeConsultModal}/>
                </Modal>
            </div>
          </div>
        </div>        
        <div className={styles.service}>
          <img src={toBg} alt="Техосмотр фон"/>
          <div className={styles.container}>
            <div className={styles.service__inner}>
              <h2 className={styles.service__title}>Техосмотр</h2>
              <h3 className={styles.service__desc}>Закажите техосмотр с низкой ценой <br /> у проверенных СТО</h3>
                <AltButtonTransparent onClick={openToModal}>Заказать техосмотр</AltButtonTransparent>
                <Modal
                  isOpen={ToIsOpen}
                  onRequestClose={closeToModal}
                  overlayClassName='overlay'
                  className='modal'
                >
                  <ToForm mode={1} closeModalAction={closeToModal}/>
                </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;