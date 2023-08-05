import React, { useEffect, useState } from 'react';
import FormInput from '../../Input/FormInput/FormInput';
import styles from './ToForm.module.css';
import Button from '../../Button/Button';
import FormArea from '../../FormArea/FormArea';
import FormSelect from '../../FormSelect/FormSelect';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../../../hooks/http.hook';
import moment from 'moment'; // Библиотека для работы с датами
import _ from 'lodash'; // По сути нужна только чтобы проверять пустой ли у нас объект
import success from '../../../../images/success.png';
import CarCategories from '../../../../models/CarCategories';
import CallTypes from '../../../../models/CallTypes';
const ToForm = ({closeModalAction, mode, dataId, ...props}) => {
  const {register,handleSubmit, control, watch, reset, formState: { errors}} = useForm();
  const {loading,request,error,clearError} = useHttp();
  const [role,setRole] = useState(); // Админ = 0, не админ = 1
  const [stage,setStage] = useState(0); // Стадия определяет какая из форм будет показываться
  const [client, setClient] = useState({}); // Объект со всеми данными о текущем клиенте
  const [price,setPrice] = useState(); // Итоговая цена ТО
  const [defaultValues,setDefaultValues] = useState(); // Изначальные значения. Нужны для автозаполнения формы если у нас будет просто изменение данных пользователя
  const gradeStage = () => setStage(stage+1); // Просто переход на следующую стадию
  const applyData = (data)=>setClient({...client, ...data,date:moment(),service:3}); // Меняет текущего клиента добавляя ему текущую дату и устанавливая, что текущая услуга - Техосмотр
  const onSubmit = data => {
    applyData(data);
    gradeStage();
  };
  useEffect(()=> { // reset обновляет все поля формы в соответствии с этим объектом, в котором хранятся данные пользователя с сервера
    reset(defaultValues);
  },[defaultValues])
  useEffect(() => {
    if(!_.isEmpty(client)){
      switch(client.carCat.value){
        case('C'): {setPrice(1500); break;}
        case('D'): {setPrice(2000); break;}
        default: {setPrice(1000); break;}
      }
    }
  },[client])
  useEffect(() => {
    if(mode===2){
      getClientData();
      const auth = localStorage.getItem('auth');
      setRole(JSON.parse(auth).role);
    }
  },[])
  const makeOrder = () => { // Применить все данные в форме и отправить их на сервер, после чего создать нового пользователя с логином = email, а пароль = номер телефона
    if(client.callType.value) {
      client.callType = client.callType.value;
      client.carCat=client.carCat.value;
      client.price=price;
    }
    if(mode===2) client.originalID=parseInt(dataId);
    async function createClient() {
      const cleanClient = _.pickBy(client,_.identity);
      if(mode==2){
        console.log(await request('/api/clients/update','POST',cleanClient).message);
      }
      else{
        console.log(await request('/api/clients/create','POST',cleanClient).message);
      }
    }
    createClient();
    createAccount();
    gradeStage();
  }
  // Получить данные клиента. Делается запрос на сервер и дефолтные значения формы устанавливаются в соответствии с ним.
  const getClientData = async () => {
    let data = await request('/api/clients/'+dataId,'GET');
    let client = {};
    client = {
      lastName:data.lastname,
      name:data.firstname,
      secondName:data.secondname,
      email:data.email,
      phone:data.phone,
      time:data.time,
      callType:{value:data.calltype,label:data.calltype},
      msg:data.msg,
      carCat:{label:data.catname,value:data.value}
    }
    setDefaultValues(client);
  }
  // Создание (или обновление имени) аккаунта для пользователя (логин - email, пароль - номер телефона в формате, в котором пользователь его ввёл)
  const createAccount = async() => {
    const credentials = {name:client.name,email:client.email,password:client.phone}
    if(mode==2){
      try{
        const res = await request('/api/users/update','POST',credentials);
      } catch(e)
      {
        console.log(e.message);
      }
    } else{
      try{
        const res = await request('/api/users/create','POST',credentials);
      } catch(e)
      {
        console.log(e.message);
      }
    }
  }
  // Тут в зависимости от стадии отображаются данные. На 0 сама форма, на 1 информация сколько это будет стоить и на 2 информация о том, что всё хорошо и что можно вернуться обратно
  const renderSwitch = (stage) => {
    switch(stage){
      case 0:{
        return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <FormInput error={errors.lastName} {...register('lastName',{required:true})} type={'text'} name={'lastName'} labelText={'Фамилия'}/>
            <FormInput error={errors.name} {...register('name',{required:true})} type={'text'} name={'name'} labelText={'Имя'}></FormInput>
            <FormInput error={errors.secondName} {...register('secondName',{required:true})} type={'text'} name={'secondName'} labelText={'Отчество'}></FormInput>
            <FormInput error={errors.phone} {...register('phone',{required:true})} type={'tel'} name={'phone'} labelText={'Номер телефона'}></FormInput>
            <FormInput error={errors.email} {...register('email',{required:true})} type={'email'} name={'email'} labelText={'Email'}></FormInput>
            <FormInput error={errors.time} {...register('time',{required:true})} type={'text'} name={'time'} labelText={'Удобное время'} placeholder={'10-14 мск'}></FormInput>
            <FormSelect classname={styles.select} error={errors.callType} control={control} Required={true} labelText={'Способ связи'} name={'callType'} placeholder={'Выберите'} options={CallTypes}/>
            <FormSelect classname={styles.select} error={errors.carCat} Required={true} control={control} defaultValue={CarCategories[0]} labelText={'Категория ТС'} name={'carCat'} options={CarCategories}/>
            <FormArea {...register('msg',{required:false})} classname={styles.area} name={'msg'} labelText={'Сообщение'} placeholder={'Ваше сообщение'}></FormArea>
          </div>
          <Button>Отправить</Button>
        </form>
        );
      }
      case 1:{
        return (
          <div className='flex items-center flex-col'>
            <div className='flex justify-around'>
              <img src={success} alt={'Успешный расчет'}/>
              <div className='flex flex-col items-center w-2/3 gap-3'>
                <p>Согласно введенным вами данным ваш техосмотр будет стоить:</p>
                <p className='text-green-500   text-4xl'>от {price} ₽</p>
              </div>
            </div>
            <Button onClick={makeOrder}>Отправить</Button>
          </div>

        )
      }
      default:{
        return (
        <div className='flex flex-col gap-5 items-center'>
          <p className='text-center'>Спасибо за ваше обращение. <br />Страховой агент свяжется с вами в указанное вами время.</p>
          <Button onClick={closeModalAction}>Вернуться</Button>
        </div>        
        )
      }
    }
  }
  return (
    <div className="container">
      <div className={styles.inner}>
        <h4 className={styles.title}>ТЕХОСМОТР</h4>
        {renderSwitch(stage)}
      </div>
    </div>
  );
};

export default ToForm;