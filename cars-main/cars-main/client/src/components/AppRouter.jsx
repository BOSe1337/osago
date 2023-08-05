import React, { useContext } from 'react';
// import Loader from './UI/Loader/Loader';
import {Navigate, Redirect, Route, Routes} from 'react-router-dom';
import { AuthContext } from '../context';
import Auto from '../pages/auto/auto';
import Login from '../pages/login';
import Main from '../pages/main/main';
import Admin from '../pages/admin/admin';
// Роутер нужен для определения куда можно пускать пользователя, а куда - нет. И какие данные отображать при перехода пользователя на те или иные ссылки.
// Нужен в первую очередь чтобы ограничить возможность клиента входить в личный кабинет, когда он не авторизован.
const AppRouter = () => {
  const {isAuth} = useContext(AuthContext);
  return (
    isAuth
      ?
      <Routes>
        <Route path="/auto" element={<Auto/>}/>
        <Route path="/login" element={<Navigate replace to="/admin"/>}/>
        <Route path="/" element={<Main/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path='*' element={<Navigate replace to="/"/>}/>
      </Routes>
      :
    <Routes>
      <Route path="/auto" element={<Auto/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Main/>}/>
      <Route path='*' element={<Navigate replace to="/"/>}/>
    </Routes>
  );
};

export default AppRouter;