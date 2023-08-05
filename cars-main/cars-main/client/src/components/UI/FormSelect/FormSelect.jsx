import React, { useState } from 'react';
import cl from './FormSelect.module.css';
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import { useHttp } from '../../../hooks/http.hook';
import AsyncSelect from 'react-select/async';
// Просто выпадающий список с возможностью поиска. Библиотека react-select. Чтобы подгружать выпадающий список во время работы программы - AsyncSelect.
const FormSelect = ({children, error, classname, address, Required, control, labelText, name, options, defaultValue, ...props}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);
  const {loading, request, clearError} = useHttp();
  // У меня есть сомнения по поводу того, что это вообще нужно, но я не помню уже будет ли всё работать без этих 2 функций.
  const handleInputChange = value => {
    setInputValue(value);
  };
 
  const handleChange = value => {
    setSelectedValue(value);
  }
  // Асинхронный запрос на сервер, который дает информацию об адресах. (пользователь вводит "Мо", а ему варианты по типу "г. Москва")
  const fetchAddress = async (inputValue) => {
    const query = {query: inputValue, count:5};
    const token = '22efd943d1bd108937808f16c7659e4a6e1f1382';
    return await request('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address','POST', query, {'Accept':'application/json', 'Authorization':'Token ' +token}).then(res=> res.suggestions);
}
  // небольшое изменение стиля select'а
  const customStyles={
    control: (provided) => ({
      ...provided,
      borderColor: error? '#dc2626':'#ababab',
      height:'42px'
    })
  }
  if(!address){ // Если в компонент передать параметр address, то будет использоваться асинхронный вариант селекта, который используется только там (только для подсказок с адресами)
    return (
      <label className={[cl.label,classname].join(" ")}>{labelText}
      <Controller // Контроллер нужен для валидации значений в react-hook-form
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={{required:Required}}
        render={({field:{onChange,value,name}}) => (
          <Select  
            styles={customStyles}
            onChange={(value)=>{onChange(value); if(props.onChange) props.onChange(value);}}
            value={value}
            name={name}
            className={cl.select} 
            options={options}
            isDisabled={props.isDisabled}
            placeholder={props.placeholder}
            theme={(theme) =>({
              ...theme,
              colors:
              {
                ...theme.colors,
                primary:error?'#dc2626':'#ababab',
                
            }})}
          />
      )}
      />
      </label>
    );
  }
  return (
    // Это для асинхронного селекта, только для адреса
    <label className={[cl.label,classname].join(" ")}>{labelText}
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{required:Required}}
      render={({field:{onChange,value,name}}) => (
          <AsyncSelect
          className={cl.select} 
          styles={customStyles}
          onChange={(value)=> {onChange(value);if(props.onChange) props.onChange(value);}}
          cacheOptions
          defaultOptions
          name={name}
          value={value}
          getOptionLabel={e => e.value}
          getOptionValue={e => e.value}
          loadOptions={fetchAddress} // Выпадающий список формируется этой функцией
          onInputChange={handleInputChange}
          placeholder={props.placeholder}
          theme={(theme) =>({
            ...theme,
            colors:
            {
              ...theme.colors,
              primary:error?'#dc2626':'#ababab',
              
          }})}
        />
     )}
    />
    </label>
  );
};
export default FormSelect;