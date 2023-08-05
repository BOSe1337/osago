import './styles/App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import {AuthContext} from './context';
import { useState } from 'react';

function App() {
  if(!localStorage.getItem('auth'))
    localStorage.setItem('auth',JSON.stringify({isAuth:false}));
  const [isAuth,setIsAuth] = useState(JSON.parse(localStorage.getItem('auth')).isAuth);
  return (
    // Контекст нам нужен только чтобы у нас статус авторизации перемещался по всему приложению. Он меняется при входе в личный кабинет и сохраняется до тех пор, пока клиент не выйдет самостоятельно из лк.
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth
    }}>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
  </AuthContext.Provider>
  );
}

export default App;
