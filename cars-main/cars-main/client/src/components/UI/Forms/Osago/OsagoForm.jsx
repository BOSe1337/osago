import React, { useEffect, useState } from 'react';
import styles from './OsagoForm.module.css';
import { Link, useLocation } from 'react-router-dom';
import FormInput from '../../Input/FormInput/FormInput';
import FormSelect from '../../FormSelect/FormSelect';
import CarCategories from '../../../../models/CarCategories';
import StageIndicator from '../../StageIndicator/StageIndicator';
import AltButton from '../../Button/AltButton/AltButton';
import Button from '../../Button/Button';
import CarIdTypes from '../../../../models/CarIdTypes';
import AltButtonGreen from '../../Button/AltButton/AltButtonGreen/AltButtonGreen';
import minus from '../../../../images/del.svg';
import success from '../../../../images/success.png';
import Checkbox from '../../Checkbox/Checkbox';
import ButtonGreen from '../../Button/ButtonGreen/ButtonGreen';
import { useForm } from 'react-hook-form';
import MaskInput from '../../MaskInput/MaskInput';
import { useHttp } from '../../../../hooks/http.hook';
import moment from 'moment';
import _ from 'lodash';
import FormArea from '../../FormArea/FormArea';
import CallTypes from '../../../../models/CallTypes';
import {ToastContainer,toast} from 'react-toastify';
const OsagoForm = ({dataId,mode,closeModalAction}) => {
  const location = useLocation(); // Позволяет получить значение из useNavigate (При переходе с другого компонента сюда передаются данные)
  const [defaultValues,setDefaultValues] = useState([{}]); // Стандартные значения, полученные от сервера, если находимся в режиме изменения имеющегося клиента
  const [drivers, setDrivers] = useState(1); // Количество водителей для отображения на форме
  const [stage,setStage] = useState(0); // Стадия формы (определяет какую разметку показывать по большей части)
  const [isOnePerson, setIsOnePerson] = useState(false); // Определяет надо ли вводить данные 
  const [isRulesApproved,setRulesApproved] = useState(false); // определяет согласился ли пользователь с соглашением об обработке персональных данных
  const [client, setClient] = useState({}); // Тут хранятся все данные клиента
  const [role,setRole] = useState();        // Текущая роль пользователя (0 - админ 1 - обычный пользователь)
  const [marks, setMarks] = useState();     // Марки автомобилей
  const [models, setModels] = useState();   // модели для выбранной марки автомобилей. И марки, и автомобили получаются от сервера из БД.
  const [price, setPrice] = useState();     // Цена полиса рассчитанная
  const [isSettlement, setIsSettlement] = useState(false); // Определяет сельская прописка или нет
  const {loading,request,error,clearError} = useHttp();
  const {register,handleSubmit, control, watch,reset, formState: { errors}} = useForm({defaultValues:{number:location.state? location.state.regNumber['RegNumber']:''}}); // React-hook-form. Для валидации
  const {register:register2,handleSubmit:handleSubmit2, control:control2, watch:watch2, reset:reset2, formState: { errors:errors2}} = useForm();
  const {register:register3,handleSubmit:handleSubmit3, control:control3, watch:watch3, reset:reset3, formState: { errors:errors3}} = useForm();
  const gradeStage =() => setStage(stage+1); // Переход по стадиям формы (какая из форм отображается)
  const toggleRulesApproved = () => setRulesApproved(!isRulesApproved);
  const degradeStage = (e) => {e.preventDefault(); setStage(stage-1); }   //Возврат на более раннюю стадию формы
  const addDriver = () => setDrivers(drivers+1); // Добавить водителя (при нажатии на соответствующую кнопку появляется разметка для этого нового пользователя)
  const removeDriver = () => setDrivers(drivers-1); // Аналогично только с удалением
  const togglePerson = () => setIsOnePerson(!isOnePerson); // Определяет обязательно ли вводить данные в поля для страхователя (если собственник и страхователь - это разные люди)
  const driverElements = []; // Массив разметок для водителей (меняется в зависимости от количества водителя drivers)
  const applyData = (data)=>setClient({...client, ...data});
  // Маски для MaskedInput
  const masks = {
    passport: [/[0-9]/,/[0-9]/,' ', /[0-9]/,/[0-9]/,' ',/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
    vin: Array(17).fill(/[a-zA-Z0-9]/i),
    gosNumber: [/[а-яА-Я]/,' ',/\d/,/\d/,/\d/,' ',/[а-яА-Я]/,/[а-яА-Я]/,' ',/\d/,/\d/]
  }
  // фильтры для них же. Фильтры нужны для валидации полей, а маски не позволяют клиенту ввести значения неподобающим способом
  const filters = {
    passport:/\d{2}[' ']\d{2}[' ']\d{6}/,
    vin: /[a-zA-Z0-9]{17}/,
    gosNumber: /[а-яА-Я][' ']\d{3}[' '][а-яА-Я]{2}[' ']\d{2}/i
  }
  useEffect(() => {
  },[errors]);
  useEffect(() => {
    clearError();
  },[error]);
  useEffect(() => {
    getMarks();
    if(mode===2){
      getClientData();
      const auth = localStorage.getItem('auth');
      setRole(JSON.parse(auth).role);
    }
  },[]);
  useEffect(() => { // Обновление форм каждой стадии в зависимости от данных на сервере (при изменении существующих данных)
    reset(defaultValues[0]);
    reset2(defaultValues[1]);
    reset3(defaultValues[2]);
  },[defaultValues])
  useEffect(() => {
    async function createClient() {
      const cleanClient = _.pickBy(client,_.identity); // очищает нашего клиента таким образом, чтобы там не осталось полей, которые были не обязательны в форме.
      if(mode==2){ // если режим изменения, то обновляем существующего клиента
        console.log(await request('/api/clients/update','POST',cleanClient).message);
      }
      else{
        console.log(await request('/api/clients/create','POST',cleanClient).message);
      }
    }
    if(stage==4){ //При окончательном изменении клиента отправляем всё на сервер
      createClient();
      createAccount();
    }
  },[client])
  // Изменение клиента (приведение его к понятному серверу формату)
  const makeOrder = () => {
    if(client.address.value){
      client.address=client.address.value;
      client.carCat=client.carCat.value;
      client.idType=client.idType.value;
      client.mark=client.mark.value;
      client.model=client.model.value;
      client.callType = client.callType.value;
      client.service = 1;
      client.date = moment();
      if(mode===2) client.originalID=parseInt(dataId);
      client.price = price;
      client.passport=client.passport.replace(' ','');
      client.passportSer = client.passport.substring(0,4);
      client.passportNum = client.passport.substring(5);
      if(!isOnePerson) {
        client.address1=client.address1.value;
        client.passport1=client.passport1.replace(' ','');
        client.passportSer1 = client.passport1.substring(0,4);
        client.passportNum1 = client.passport1.substring(5);
      }
      const driverData=[];
      for(let i=0; i < drivers; i++){
        driverData.push({
          birthDate: client['DbirthDate'+i],
          lastName: client['DlastName'+i],
          name: client['Dname'+i],
          secondName: client['DsecondName'+i],
          startYear: client['DstartYear'+i],
          vu: client['Dvu'+i]
        });
      }
      setClient({...client,driverdata:JSON.stringify(driverData)});
    }
    gradeStage();
  }
  // Создание или изменение пользователя
  const createAccount = async() => {
    const credentials = {name:client.name,email:client.email,password:client.phone}
    if(mode==2){
      try{
        const res = await request('/api/users/update','POST',credentials);
        console.log(res);
      } catch(e)
      {
        console.log(e.message);
      }
    } else{
      try{
        const res = await request('/api/users/create','POST',credentials);
        console.log(res);
      } catch(e)
      {
        console.log(e.message);
      }
    }
  }
  //Получение данных о клиенте (для автозаполнения форм)
  const getClientData = async () => {
    let data = await request('/api/clients/'+dataId,'GET');
    let driverData = JSON.parse(data.driverdata);
    let client = [];
    client.push({
      number:data.number,
      power:data.power,
      carCat:{label:data.catname,value:data.value},
      mark:{label:data.mark,value:data.mark},
      model:{label:data.model,value:data.model},
      idType:{label:data.idtype, value:data.idvalue},
      id:data.idcode
    });
    setDrivers(driverData.length);
    client.push({});
    driverData.forEach((driver, index) => {
      driverData[index] = JSON.parse(driver);
      client[1] = {
        ...client[1],
        ['DbirthDate'+index]:driverData[index].birthDate.substring(0,10),
        ['DlastName'+index]:driverData[index].lastName,
        ['Dname'+index]:driverData[index].name,
        ['DsecondName'+index]:driverData[index].secondName,
        ['DstartYear'+index]:driverData[index].startYear,
        ['Dvu'+index]:driverData[index].vu
      }
    })
    client.push({});
    const query = {query: data.address, count:2}; // Запрос на сервер адресов, чтобы наверняка корректное значение выбралось
    const token = '22efd943d1bd108937808f16c7659e4a6e1f1382';
    let addressData = await request('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address','POST', query, {'Accept':'application/json', 'Authorization':'Token ' +token}).then(res=> res.suggestions);
    addressData = addressData[0];
    const passportSer = data.passportser.substring(0,2) + ' ' +data.passportser.substring(2); // Вытащить корректную серию паспорта
    client[2] = {
      lastName:data.lastname,
      name:data.firstname,
      secondName:data.secondname,
      birthDate:data.birthdate.substring(0,10),
      passportDate:data.passportdate.substring(0,10),
      address:addressData,
      apartments:data.aparts,
      email:data.email,
      phone:data.phone,
      time:data.time,
      callType:{value:data.calltype,label:data.calltype},
      msg:data.msg,
      passport:passportSer+' '+data.passportnum
    }
    if(data.stfirstname!='' && data.stfirstname!=undefined){
      const query1 = {query:data.staddress, count:2};
      const passportSer1 = data.stpassportser.substring(0,2) + ' ' +data.stpassportser.substring(2);
      let addressData1 = await request('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address','POST', query1, {'Accept':'application/json', 'Authorization':'Token ' +token}).then(res=> res.suggestions);
      addressData1 = addressData1[0];
      setIsOnePerson(false);
      client[2] = {
        ...client[2],
        lastName1:data.stlastname,
        name1:data.stfirstname,
        secondName1:data.stsecondname,
        birthDate1:data.stbirthdate.substring(0,10),
        passportDate1:data.stpassportdate.substring(0,10),
        address1:addressData1,
        apartments1:data.staparts,
        passport1:passportSer1+' '+data.stpassportnum
      }
    }
    else setIsOnePerson(true);
    loadModels({label:data.mark,value:data.mark}) // Получить модели для этой марки машин
    setDefaultValues(client);
  }
  // Получение всех марок автомобилей с сервера для выпадающего списка на 1 форме
  const getMarks = async () => {
    try{
      let data = await request('/api/cars/marks','GET');
      data = data.map(el => ({label:el.mark,value:el.mark}));
      setMarks(data);
    }
    catch(e){
      console.log('Не получены данные о марках от сервера',e.message);
    }
  }
  // Получение всех моделей этой марки для выпадающего списка на 1 форме
  const loadModels = async (selectedOption) => {
    try{
      let data = await request('/api/cars/'+selectedOption.label,'GET');
      data = data.map(el => ({label:el.model,value:el.model}));
      setModels(data);
    }
    catch(e){
      console.log('Не получены данные о марках от сервера',e.message);
    }
  }
  // При подтверждении формы сохранение данных, расчет стоимости.
  const onSubmit = data => {
    applyData(data);
    if(stage===2){
      let oldestBD = moment(client.DbirthDate0);
      let oldestSt = moment(client.DstartYear0);
      const now = moment();
      let KBS;
      for(let i = 1; i<drivers;i++){
        const birthDate = moment(client['DbirthDate'+i]);
        const startYear = moment(client['DstartYear'+i]);
        if(birthDate.diff(oldestBD)>0) oldestBD=birthDate; 
        if(startYear.diff(oldestSt)>0) oldestSt=startYear; 
      }
      oldestBD = now.diff(oldestBD,'years');
      oldestSt = now.diff(oldestSt,'years');
      console.log(`Возраст ${oldestBD}, Стаж ${oldestSt}`)
      if(oldestSt<3 && oldestBD<22) KBS = 1.92;
      else {
        switch(true){
          case (oldestBD < 22): {KBS = 1.65; break;}
          case (oldestBD > 22 && oldestBD < 30): {KBS = 1.09; break;}
          case (oldestBD > 30 && oldestBD < 50): {KBS = 1.01; break;}
          default: KBS = 0.9;
          }
        }

        let KM;
        switch(true){
          case (client.power < 50): { KM = 0.6; break;}
          case (client.power < 70 && client.power > 50):  { KM = 1; break; }
          case (client.power < 100 && client.power > 70): { KM = 1.1; break; }
          case (client.power < 120 && client.power > 100): { KM = 1.2; break; }
          default: KM = 1.6;
        }

        const KT = isSettlement? 0.8 : 1.7;
        const total = 4400 * KT * KM * KBS * 0.5;
        console.log(`KT: ${KT}, KM: ${KM}, KBS: ${KBS}`);
        setPrice(Math.round(total));
      }
    gradeStage();
  };
  // Проверка, что указан населенный пункт меньше города для расчета стоимости
  const handleAddressChange = (value) => {
    if(value.data.settlement){
      setIsSettlement(true);
    } else{
      setIsSettlement(false);
    }
  }
  // Верстка для каждого водителя в зависимости от того сколько водителей сейчас
  for(let i = 0; i < drivers; i++){
    driverElements.push(
    <div key={i}>
      <div className='flex justify-between'>
        <h4>{i+1} водитель:</h4>
        {drivers>1 &&
                <div className={styles.minusBtnWrapper} onClick={removeDriver}>
                <img className={styles.minusBtn} src={minus} alt={'Убрать водителя'}/>
                </div>
        }
      </div>
      <div className={styles.stageGrid}>
        <FormInput error={errors2['DlastName'+i]} {...register2('DlastName'+i,{required:true, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Фамилия'} name={'DlastName'+i}/>
        <FormInput error={errors2['Dname'+i]} {...register2('Dname'+i,{required:true, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Имя'} name={'Dname'+i}/>
        <FormInput error={errors2['DsecondName'+i]} {...register2('DsecondName'+i,{required:true, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Отчество'} name={'DsecondName'+i}/>
        <FormInput error={errors2['DbirthDate'+i]} {...register2('DbirthDate'+i,{required:true})} type={'date'} labelText={'Дата рождения'} name={'DbirthDate'+i}/>
        <MaskInput error={errors2['Dvu'+i]} control={control2} Required={true} labelClass={'col-span-2'} type={'text'} labelText={'Серия и номер ВУ'} name={'Dvu'+i} mask={masks.passport} filter={filters.passport} />
        <FormInput error={errors2['DstartYear'+i]} {...register2('DstartYear'+i,{required:true})} type={'date'} labelText={'Дата начала стажа'} name={'DstartYear'+i}/>
      </div>
      {(i === (drivers-1) && drivers<5) &&
              <AltButtonGreen onClick={addDriver}>Добавить водителя</AltButtonGreen>
      }
    </div>
    )
  }
  // Группа кнопок, которые всегда внизу. Если Режим установлен, то форма с админки пришла, значит это модалка и нужно при нажатии на назад не выходить на главную, а скрывать модалку.
  // на последней стадии правая кнопка меняется на заказать/сохранить
  const BtnGroup = 
    <div className='flex justify-between'>
      {!stage
      ?
        mode
        ?
        <AltButton onClick={closeModalAction}>Назад</AltButton>
        :
        <Link to="/">
          <AltButton>Назад</AltButton>
        </Link>
      :
      <AltButton onClick={degradeStage}>Назад</AltButton>
      }
      {stage===3
      ?
        <ButtonGreen onClick={makeOrder}>{!mode? 'Заказать':'Сохранить'}</ButtonGreen>
      :
      <Button>Продолжить</Button>
      }
    </div>
    // Сообщение о том, что клиент некорректно ввел данные
  const Message = 
    <p className='p-2 rounded-md text-red-800 bg-red-300'>
      Пожалуйста, заполните корректно все отмеченные поля
    </p>
    //Разная верстка в зависимости от стадии
  const renderSwitch = (stage) => {
    switch(stage){
      case 0:{
        return (
          <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.stageGrid}>
              <div className={styles.firstRow}>
                <FormSelect error={errors.carCat} Required={true} control={control} defaultValue={CarCategories[0]} labelText={'Категория ТС'} name={'carCat'} options={CarCategories}/>
                <MaskInput error={errors.number} control={control} Required={true} type={'text'} labelText={'Гос. номер'} name={'number'} mask={masks.gosNumber} filter={filters.gosNumber} />
              </div>
              <FormSelect error={errors.mark} control={control} Required={true} labelText={'Марка'} name={'mark'} placeholder={'Выберите'} options={marks} onChange={loadModels}/>
              <FormSelect isDisabled={!models} error={errors.model} control={control} Required={true} labelText={'Модель'} name={'model'} placeholder={'Выберите'} options={models}/>
              <FormInput error={errors.power} {...register('power',{required:true})} type={'number'} labelText={'Мощность двигателя'} name={'power'} placeholder={'100'}/>
              <FormSelect error={errors.idType} control={control} Required={true} defaultValue={CarIdTypes[0]} labelText={'Идентификатор'} name={'idType'} options={CarIdTypes} />
              <MaskInput error={errors.id} control={control} Required={true} type={'text'} labelClass={'col-span-2'} labelText={'Номер'} name={'id'} mask={masks.vin} filter={filters.vin} />
            </div>
            {/* Если есть ошибки, то выводится сообщение что клиент некорректно ввел данные*/}
            {!_.isEmpty(errors) && 
            Message}
            {/* А здесь наша группа кнопок, которые были ранее */}
            {BtnGroup}
          </form>
        );
      }
      case 1:{
        return (
          <form className='flex flex-col gap-8' onSubmit={handleSubmit2(onSubmit)}>
          {driverElements}
          {!_.isEmpty(errors2) && 
            Message}
          {BtnGroup}
          </form>
        )
      }
      case 2:{
        return (
          <form className='flex flex-col gap-8' onSubmit={handleSubmit3(onSubmit)}>
            <h4 className='text-left'>Данные собственника</h4>
            <div className={styles.stageGrid}>
              <FormInput error={errors3.lastname} {...register3('lastName',{required:true, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Фамилия'} name={'lastName'}/>
              <FormInput error={errors3.name} {...register3('name',{required:true, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Имя'} name={'name'}/>
              <FormInput error={errors3.secondName} {...register3('secondName',{required:true, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Отчество'} name={'secondName'}/>
              <FormInput error={errors3.birthDate} {...register3('birthDate',{required:true})} type={'date'} labelText={'Дата рождения'} name={'birthDate'}/>
              <MaskInput error={errors3.passport} control={control3} Required={true} type={'text'} labelText={'Серия и номер паспорта'} name={'passport'} mask={masks.passport} filter={filters.passport} />
              <FormInput error={errors3.passportDate} {...register3('passportDate',{required:true})} type={'date'} labelText={'Дата выдачи'} name={'passportDate'}/>
              <FormSelect address={true} error={errors3.address} control={control3} Required={true} classname={'col-span-2'} labelText={'Адрес регистрации (город, улица, дом)'} name={'address'} placeholder={'Введите'} onChange={handleAddressChange}/>
              <FormInput error={errors3.apartments} {...register3('apartments',{required:true, pattern:/[0-9]+/})} type={'number'} labelText={'Квартира'} min={'1'} name={'apartments'}/>
            </div>
            <div className={styles.additionalForm}>
              <Checkbox checked={isOnePerson} onchange={togglePerson}>Страхователь совпадает с собственником</Checkbox>
              {!isOnePerson &&
                <div className={styles.stageGrid}>
                  <FormInput error={errors3.lastName1} {...register3('lastName1',{required:!isOnePerson, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Фамилия'} name={'lastName1'}/>
                  <FormInput error={errors3.name1} {...register3('name1',{required:!isOnePerson, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Имя'} name={'name1'}/>
                  <FormInput error={errors3.secondName1} {...register3('secondName1',{required:!isOnePerson, pattern:/[а-яА-ЯёЁa-zA-Z]+/i})} type={'text'} labelText={'Отчество'} name={'secondName1'}/>
                  <FormInput error={errors3.birthDate1} {...register3('birthDate1',{required:!isOnePerson})} type={'date'} labelText={'Дата рождения'} name={'birthDate1'}/>
                  <MaskInput error={errors3.passport1} control={control3} Required={!isOnePerson} type={'text'} labelText={'Серия и номер паспорта'} name={'passport1'} mask={masks.passport} filter={filters.passport} />
                  <FormInput error={errors3.passportDate1} {...register3('passportDate1',{required:!isOnePerson})} type={'date'} labelText={'Дата выдачи'} name={'passportDate1'}/>
                  <FormSelect error={errors3.address1} address={true} control={control3} Required={!isOnePerson} classname={'col-span-2'} labelText={'Адрес регистрации (город, улица, дом)'} name={'address1'} placeholder={'Введите'}/>
                  <FormInput error={errors3.apartments1} {...register3('apartments1',{required:!isOnePerson, pattern:/[0-9]+/})} type={'number'} labelText={'Квартира'} min={'1'} name={'apartments1'}/>
                </div>
              }
            </div>
            {/* Если режим добавления, то эта секция видима, иначе - нет. */}
            {mode!=2 &&
              <div className='flex flex-col gap-4'>
                <h4 className='text-left'>Контактные данные</h4>
                <p>На электронную почту будет отправлен ваш готовый полис, а номер телефона может использоваться для связи с вами</p>
                <div className={styles.stageGrid}>
                  <FormInput error={errors3.email} {...register3('email',{required:true})} type={'email'} labelText={'Электронная почта'} name={'email'}/>
                  <FormInput error={errors3.phone} {...register3('phone',{required:true})} type={'tel'} labelText={'Номер телефона'} name={'phone'}/>
                  <FormInput error={errors3.time} {...register3('time',{required:true})} type={'text'} name={'time'} labelText={'Удобное время'} placeholder={'10-14 мск'}></FormInput>
                  <FormSelect classname={styles.select} error={errors3.callType} control={control3} Required={true} labelText={'Способ связи'} name={'callType'} placeholder={'Выберите'} options={CallTypes}/>
                  <FormArea {...register3('msg',{required:false})} classname={'col-span-2'} name={'msg'} labelText={'Сообщение'} placeholder={'Ваше сообщение'}></FormArea>   
                </div>
                {!mode &&
                <Checkbox error={errors3.rules} control={control3} checked={isRulesApproved} onchange={toggleRulesApproved} name={'rules'}>Согласен с <span className='text-blue-800'>правилами предоставления информации</span></Checkbox>
                }
              </div>
            }
            {!_.isEmpty(errors3) && 
            Message}
            {BtnGroup}
          </form>
        )
      }
      case 3:{
        return (
          <div>
            <h4 className='text-left'>Расчет</h4>
            <div className='flex justify-around'>
              <img src={success} alt={'Успешный расчет'}/>
              <div className='flex flex-col items-center w-2/3 gap-3'>
                <p>Согласно введенным вами данным ваш полис ОСАГО будет стоить:</p>
                <p className='text-green-500   text-4xl'>от {price} ₽</p>
              </div>
            </div>
            {BtnGroup}
          </div>
        )
      }
      default:{
        return (
          <div className='flex flex-col gap-5 items-center'>
          <p className='text-center'>Спасибо за ваше обращение. <br />Страховой агент свяжется с вами в указанное вами время.</p>
          {mode
          ?
          <Button onClick={closeModalAction}>Вернуться</Button>
          :
          <Link to="/"><Button>Вернуться</Button></Link>
          }
        </div>
        )        
      }
    }
  }
  return (
    <div className={styles.inner}>
      <h2 className={styles.title}>Данные для расчёта</h2>
      <StageIndicator stage={stage}></StageIndicator>
      <div>
        {renderSwitch(stage)}
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OsagoForm;