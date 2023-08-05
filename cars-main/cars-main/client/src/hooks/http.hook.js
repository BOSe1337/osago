import { useCallback, useState } from "react"
// Хук для всех запросов на сервер
export const useHttp = () => {
  const [loading, setLoading] = useState(false); // Для создания лоадеров (когда грузится контент у нас появляется анимация)
  const [error, setError] = useState(null); //Показывает ошибку во время запроса
  // Тут обычный метод fetch, который обернут в useCallback чтобы не зацикливался. Во втором случае немного другие заголовки, потому что там заголовки подготавливает браузер самостоятельно.
  const request = useCallback( async (url, method = 'POST', body = null, headers={}) => {
    setLoading(true);
    try{
      if(body){
        body = JSON.stringify(body);
        if(headers['Content-Type']===undefined)
          headers['Content-Type']= 'application/json';
      }
      const response = await fetch(url,{method,body,headers})
      const data = await response.json()
      if(!response.ok){
        throw new Error(data.message || 'Что-то пошло не так')
      }
      setLoading(false);
      return data;
    }
    catch(e){
      setLoading(false);
      setError(e.message);
      throw e;
    }
  },[]);
  const fileRequest = useCallback( async (url, method = 'POST', body = null) => {
    setLoading(true);
    try{
      const response = await fetch(url,{body,method})
      const data = await response.json()
      if(!response.ok){
        throw new Error(data.message || 'Что-то пошло не так')
      }
      setLoading(false);
      return data;
    }
    catch(e){
      setLoading(false);
      setError(e.message);
      throw e;
    }
  },[]);
  const clearError = useCallback(() => setError(null),[]);  // Обнуление ошибок
  return {loading,request,fileRequest,error,clearError};    // И экспорт этого всего туда, где нам это надо. 
}