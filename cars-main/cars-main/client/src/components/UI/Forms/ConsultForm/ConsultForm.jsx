import React, { useEffect, useState } from 'react';
import FormInput from '../../Input/FormInput/FormInput';
import styles from './ConsultForm.module.css';
import Button from '../../Button/Button';
import FormArea from '../../FormArea/FormArea';
import FormSelect from '../../FormSelect/FormSelect';
import { useForm } from 'react-hook-form';
import { useHttp } from '../../../../hooks/http.hook';
import moment from 'moment';
import _ from 'lodash';
import CallTypes from '../../../../models/CallTypes';
const ConsultForm = ({closeModalAction, mode, dataId, ...props}) => {
  const {register,handleSubmit, control, watch, reset, formState: { errors}} = useForm();
  const {loading,request,error,clearError} = useHttp();
  const [role,setRole] = useState();
  const [stage,setStage] = useState(0); // Стадия на которой находится форма (решает что будет отображаться)
  const [client, setClient] = useState({}); // Данные о клиенте
  const [defaultValues,setDefaultValues] = useState(); // Стандартные данные (клиента), которые заносятся в форму при изменении уже существующего клиента
  const gradeStage = () => setStage(stage+1);
  const applyData = (data)=>setClient({...client, ...data,date:moment(),service:4}); //В конце формы при отправке её к ней добавляется еще текущая дата и тип услуги 4 - Консульт.
  const onSubmit = data => {
    applyData(data);
  };
  useEffect(()=> {
    reset(defaultValues); // Обновление формы данными клиента если происходит изменение данных
  },[defaultValues])
  useEffect(() => {
    if(!_.isEmpty(client)){
      if(client.callType.value) client.callType = client.callType.value; // Из-за того, что select возвращает немного не то значение, какое нужно, мы приводим к корректному виду
      if(mode===2) client.originalID=parseInt(dataId); // Если изменяются данные клиента, то необходимо получить id пользователя, у которого эти данные будут меняться
      async function createClient() { // Добавление нового клиента, либо изменение его в зависимости от режима формы (1 - добавление, 2 - изменение)
        const cleanClient = _.pickBy(client,_.identity); // Очистка данных клиента от ненужных/пустых полей перед отправкой
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
  },[client])
  useEffect(() => {
    if(mode===2){
      getClientData();
      const auth = localStorage.getItem('auth');
      setRole(JSON.parse(auth).role);
    }
  },[])
  // Получение данных клиента, чтобы потом заполнить ими форму, если мы меняем уже имеющиеся данные клиента
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
      msg:data.msg
    }
    setDefaultValues(client);
  }
  // Создание аккаунта, либо изменение имени пользователя
  const createAccount = async() => {
    const credentials = {name:client.name,email:client.email,password:client.phone}
    if(mode==2){
      try{
        const res = await request('/api/users/update','POST',credentials);
      } catch(e)
      {
        console.log(e.message);
      }
    }
    else{
      try{
        const res = await request('/api/users/create','POST',credentials);
      } catch(e)
      {
        console.log(e.message);
      }
    }
  }
  return (
    <div className="container">
      <div className={styles.inner}>
        <h4 className={styles.title}>КОНСУЛЬТАЦИЯ</h4>
        {stage==0
        ?
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            <FormInput error={errors.lastName} {...register('lastName',{required:true})} type={'text'} name={'lastName'} labelText={'Фамилия'}/>
            <FormInput error={errors.name} {...register('name',{required:true})} type={'text'} name={'name'} labelText={'Имя'}></FormInput>
            <FormInput error={errors.secondName} {...register('secondName',{required:true})} type={'text'} name={'secondName'} labelText={'Отчество'}></FormInput>
            <FormInput error={errors.phone} {...register('phone',{required:true})} type={'tel'} name={'phone'} labelText={'Номер телефона'}></FormInput>
            <FormInput error={errors.email} {...register('email',{required:true})} type={'email'} name={'email'} labelText={'Email'}></FormInput>
            <FormInput error={errors.time} {...register('time',{required:true})} type={'text'} name={'time'} labelText={'Удобное время'} placeholder={'10-14 мск'}></FormInput>
            <FormSelect classname={styles.select} error={errors.callType} control={control} Required={true} labelText={'Способ связи'} name={'callType'} placeholder={'Выберите'} options={CallTypes}/>
            <FormArea {...register('msg',{required:false})} classname={styles.area} name={'msg'} labelText={'Сообщение'} placeholder={'Ваше сообщение'}></FormArea>
          </div>
          <Button>Отправить</Button>
        </form>
        :
        <div className='flex flex-col gap-5 items-center'>
          <p className='text-center'>Спасибо за ваше обращение. <br />Страховой агент свяжется с вами в указанное вами время.</p>
          <Button onClick={closeModalAction}>Вернуться</Button>
        </div>
        }
      </div>
    </div>
  );
};

export default ConsultForm;