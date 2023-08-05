import React, {useState, useEffect} from 'react';
import LoginForm from '../components/UI/LoginForm/LoginForm';
// import Loader from '../components/UI/Loader/Loader';
// Страница авторизации
const Login = () => {
  return (
    <div className='flex flex-1 min-h-screen'>
      <LoginForm/>
    </div>
  );
};

export default Login;