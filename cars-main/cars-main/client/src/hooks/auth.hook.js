import { useContext } from "react";
import { AuthContext } from "../context";
import { useHttp } from "./http.hook";
// Хук для авторизации пользователя в системе. Нужен для 2 методов входа в систему и выхода из системы. Нужен по большей части для того, чтобы изменять значения в памяти браузера, связанные с текущей сессией пользователя.  
export const useAuth = () => {
  const {isAuth, setIsAuth} = useContext(AuthContext); 
  const {loading,request,error,clearError} = useHttp();
  const login = async (email,password) => {
    const query = {email,password};
    try{
      let data = await request('/api/users/check','POST', query);
      localStorage.setItem('auth',JSON.stringify({token:data.token,name:data.name,isAuth:true,role:data.role,email:email,id:data.id})); // Local Storage - это хранилище данных браузера. Нужно чтобы после обновления страницы информация о сессии оставалась.
      setIsAuth(true);
    } catch(e) {
      console.log('Произошла ошибка при аутентификации',e.message);
    }
  }
  const logout = () => {
    setIsAuth(false);
    const auth = JSON.stringify({
      isAuth:false,
      name:undefined,
      token:undefined
    })
    localStorage.setItem("auth",auth);
  }
  return {isAuth,login,logout};
}