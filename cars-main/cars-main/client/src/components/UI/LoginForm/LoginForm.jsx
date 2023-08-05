import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './LoginForm.module.css';
import { Link } from 'react-router-dom';
import AltButton from '../Button/AltButton/AltButton';
import { useHttp } from '../../../hooks/http.hook';
import { useForm } from 'react-hook-form';
import FormInput from '../Input/FormInput/FormInput';
import { useAuth } from '../../../hooks/auth.hook';
const LoginForm = () => {
  const [email,setEmail] = useState('');
  const {login} = useAuth();
  const [show,setShow] = useState(true);
  const [password,setPassword] = useState('');
  const {loading, request, error, clearError} = useHttp();
  const {unregister,register,handleSubmit, control, watch, formState: { errors}} = useForm({shouldUnregister:true}); // Тут React-hook-form опять же, однако здесь у нас в случае нажатия на кнопку "Забыли пароль" нужно чтобы убралось поле с паролем. 
  const onSubmit = () => validate(); // При подтверждении формы проходит проверка если у нас сокрыто поле с паролем, то отправляется пароль на почту, если же поле не сокрыто, то попытка авторизации
  const validate = async () => {
    if(!show){
      sendPass();
    } else{
      auth();
    }
  }
  const auth = async () => {
    login(email,password);
  }
  // Выключение валидации для поля пароля и отключение его отображения
  const turnPassOff = () => {
    unregister('pass');
    setShow(false);
  }
  const turnPassOn = () => {
    setShow(true);
  }
  // отправка письма
  const sendPass = async (e) => {
    try{
      return await request('/api/users/'+email,'GET');
    } catch(e) {
      console.log('Произошла ошибка при отправке сообщения',e.message );
    }
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h3 className={styles.title}>Личный кабинет</h3>
      <p className={styles.desc}>На этой странице вы можете посмотреть и изменить введенную вами информацию,<br /> а также скачать документы, которые для вас подготовили <br /> <Link to="/">Вернуться на главную</Link> </p>
      <div className={styles.formGrid}>
        <FormInput error={errors.email} {...register('email',{required:true})} name={'email'} type="text" value={email} onChange={e=> setEmail(e.target.value)} classname={styles.input} placeholder='Email' labelText={'Электронная почта'}></FormInput>
        {show&& <FormInput error={errors.pass} {...register('pass',{required:true})} name={'pass'}  value={password} onChange={e => setPassword(e.target.value)} classname={styles.input} type='password' placeholder='Пароль' labelText={'Пароль'}></FormInput>}
        <div className={styles.buttonGroup}>
          <Button onClick={turnPassOn}>Войти</Button>
          <AltButton onClick={turnPassOff}>Забыли пароль?</AltButton>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;