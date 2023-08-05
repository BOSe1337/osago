import { useHttp } from "./http.hook";
// Просто экспорт данных. Один запрос к серверу.
export const useExport = () => {
  const {loading,request,error,clearError} = useHttp();
  const fetch = async () => {
    try{
      let data = await request('/api/clients/export','GET');
      return data;
    } catch(e) {
      console.log('Произошла ошибка при экспорте',e.message );
    }
  }
  return {fetch};
}