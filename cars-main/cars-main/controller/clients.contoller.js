const db = require('../db');
const config = require('config');
const {dirname} = require('path');
const fs = require('fs');

class ClientsController {
  
  // Добавление нового клиента. Поступает запрос с полной информацией о клиенте, создается человек (таблица persons), который хранит персональные данные о страхователе/собственнике.
  // После чего создается клиент
  async addClient(req,res){
    const client = req.body;
    switch(client.service){
      case(1) : {
        const driverData = JSON.parse(client.driverdata);
        let carId='';
        try{
          carId= await db.query("select id from models where mark=$1 and model=$2",[client.mark,client.model]);
          carId = carId.rows[0].id;
        }
        catch(e){
          return res.status(400).json({message:'Не найдено такой модели'});
        }
        const sobstvennik = {
          firstname:client.name,
          secondname:client.secondName,
          lastname:client.lastName,
          birthdate:client.birthDate,
          passportser:client.passportSer,
          passportnum:client.passportNum,
          passportdate:client.passportDate,
          address:client.address,
          apartments:client.apartments
        };
        try{
          const sobstvId = await db.query("insert into persons(firstname,secondname,lastname,birthdate,passportser,passportnum,passportdate,address,aparts) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",Object.values(sobstvennik));
          sobstvennik.id=sobstvId.rows[0].id;
        }
        catch(e){
          return console.log('Собственник не добавлен' + e.message);
        }
        if(client.lastName1!='' && client.lastName1!=undefined){
          const strahovatel = {
            firstname:client.name1,
            secondname:client.secondName1,
            lastname:client.lastName1,
            birthdate:client.birthDate1,
            passportser:client.passportSer1,
            passportnum:client.passportNum1,
            passportdate:client.passportDate1,
            address:client.address1,
            apartments:client.apartments1
          };
          try{
            const strahId = await db.query("insert into persons(firstname,secondname,lastname,birthdate,passportser,passportnum,passportdate,address,aparts) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",Object.values(strahovatel));
            strahovatel.id=strahId.rows[0].id;
          }
          catch(e){
            return console.log('Страхователь не добавлен' + e.message);
          }
          try{
            await db.query(`insert into clients
            (strahovatel,sobstvennik,carcat,number,model,power,idtype,idcode,driverdata,email,phone,price,service,date,time,callType,msg) 
            values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
            [strahovatel.id,sobstvennik.id,client.carCat,client.number,carId,client.power,client.idType,client.id,driverData,client.email,client.phone,client.price,client.service,client.date,client.time,client.callType,client.msg]);
            return res.json({message:'Клиент добавлен'});
          } catch(e){
            return res.status(400).json({message:'Не удалось добавить клиента' + e.message});
          }
        }
        try{
          await db.query(`insert into clients
          (strahovatel,sobstvennik,carcat,number,model,power,idtype,idcode,driverdata,email,phone,price,service,date,time,callType,msg) 
          values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
          [1,sobstvennik.id,client.carCat,client.number,carId,client.power,client.idType,client.id,driverData,client.email,client.phone,client.price,client.service,client.date, client.time,client.callType,client.msg]);
          return res.json({message:'Клиент добавлен'});
        } catch(e){
          return res.status(400).json({message:'Не удалось добавить клиента' + e.message});
        }
        break;
      }
      case (4): {
        const sobstvennik = {
          firstname:client.name,
          secondname:client.secondName,
          lastname:client.lastName
        };
        try{
          const sobstvId = await db.query("insert into persons(firstname,secondname,lastname) values($1,$2,$3) returning id",Object.values(sobstvennik));
          sobstvennik.id=sobstvId.rows[0].id;
        }
        catch(e){
          return res.status(400).json('Не удалось добавить человека'+e.message);
        }
        try{
          await db.query(`insert into clients
          (strahovatel,sobstvennik,email,phone,service,date,time,callType,msg) 
          values($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [1,sobstvennik.id,client.email,client.phone,client.service,client.date, client.time,client.callType,client.msg]);
          return res.json({message:'Клиент добавлен'});
        } catch(e){
          return res.status(400).json({message:'Не удалось добавить клиента' + e.message});
        }
        break;
      }
      case (3): {
        const sobstvennik = {
          firstname:client.name,
          secondname:client.secondName,
          lastname:client.lastName
        };
        try{
          const sobstvId = await db.query("insert into persons(firstname,secondname,lastname) values($1,$2,$3) returning id",Object.values(sobstvennik));
          sobstvennik.id=sobstvId.rows[0].id;
        }
        catch(e){
          return res.status(400).json('Не удалось добавить человека'+e.message);
        }
        try{
          await db.query(`insert into clients
          (strahovatel,sobstvennik,carcat,email,phone,service,date,time,callType,msg) 
          values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [1,sobstvennik.id,client.carCat,client.email,client.phone,client.service,client.date, client.time,client.callType,client.msg]);
          return res.json({message:'Клиент добавлен'});
        } catch(e){
          return res.status(400).json({message:'Не удалось добавить клиента' + e.message});
        }
        break;
      }
    }
  }
  // Все данные для представления в таблице в админке
  async viewClients(req,res) {
    try{
      const data = await db.query('select * from admintable');
      return res.json(data.rows);
    }
    catch(e){
      return res.status(400).json({message:'Не получилось получить данные из представления'});
    }
  }
  // Получить все данные о конкретном клиенте. Используется только в личном кабинете при получении данных о клиенте, который в сети
  async fetchOne(req,res) {
    const id = req.params.id;
    try{
      const data = await db.query('select * from admintable where id=$1',[id]);
      data.rows[0].driverdata=JSON.stringify(data.rows[0].driverdata);
      return res.json(data.rows[0]);
    }
    catch(e){
      return res.status(400).json({message:'Не получилось получить данные из представления'});
    }
  } 
  // Получение ID и типа услуги (Осаго, Консультация, ТО) по email клиента (для )
  async fetchByEmail(req,res) {
    const email = req.params.email;
    try{
      const data = await db.query('select id,type from admintable where email=$1',[email]);
      return res.json(data.rows[0]);
    }
    catch(e){
      return res.status(400).json({message:'Не получилось получить данные из представления'});
    }
  } 
  // Получение данных для экспорта. Просто все данные из представления ExportData
   async getExport(req,res) {
    try{
      const data = await db.query('select * from exportdata');
      return res.json(data.rows);
    }
    catch(e){
      return res.status(400).json({message:'Не получилось получить данные из представления', error:e.message});
    }
  }
  // Обновление данных о клиенте. Switch нужен чтоб определить какой вид услуги был у него (чтобы понять какие поля вообще стоит обновлять). Собственно из формы подтягиваются в виде запроса
  // все данные о клиенте и старые заменяются новыми. Таким образом меняются таблицы clients и persons. Используется в личном кабинете и админке при редактировании данных пользователя.
  async updateClient(req,res){
    const client = req.body;
    let oldClient;
    try{
      oldClient = await db.query("select * from clients where id=$1",[client.originalID]);
      oldClient= oldClient.rows[0];
    }
    catch(e){
      return res.status(400).json({message:'Не найдено такого клиента'});
    }
    switch(oldClient.service){
      case (1):{
        const driverData = JSON.parse(client.driverdata);
        let carId='';
        try{
          carId= await db.query("select id from models where mark=$1 and model=$2",[client.mark,client.model]);
          carId = carId.rows[0].id;
        }
        catch(e){
          return res.status(400).json({message:'Не найдено такой модели'});
        }
        const sobstvennik = {
          firstname:client.name,
          secondname:client.secondName,
          lastname:client.lastName,
          birthdate:client.birthDate,
          passportser:client.passportSer,
          passportnum:client.passportNum,
          passportdate:client.passportDate,
          address:client.address,
          apartments:client.apartments
        };
        try{
          const sobstId = await db.query("update persons set firstname=$1,secondname=$2,lastname=$3,birthdate=$4,passportser=$5,passportnum=$6,passportdate=$7,address=$8,aparts=$9 where id=$10 returning id",[...Object.values(sobstvennik),oldClient.sobstvennik]);
          sobstvennik.id = sobstId.rows[0].id;
        }
        catch(e){
          return res.status(400).json({message:'Собственник не изменен' + e.message});
        }
        if(client.lastName1!='' && client.lastName1!=undefined){
          const strahovatel = {
            firstname:client.name1,
            secondname:client.secondName1,
            lastname:client.lastName1,
            birthdate:client.birthDate1,
            passportser:client.passportSer1,
            passportnum:client.passportNum1,
            passportdate:client.passportDate1,
            address:client.address1,
            apartments:client.apartments1
          };
          try{
            if(oldClient.strahovatel){
              const strahId = await db.query("update persons set firstname=$1,secondname=$2,lastname=$3,birthdate=$4,passportser=$5,passportnum=$6,passportdate=$7,address=$8,aparts=$9, where id=$10 returning id",[...Object.values(strahovatel),oldClient.strahovatel]);
              strahovatel.id=strahId.rows[0].id;        
            }
            else{
              const strahId = await db.query("insert into persons(firstname,secondname,lastname,birthdate,passportser,passportnum,passportdate,address,aparts) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",Object.values(strahovatel));
              strahovatel.id=strahId.rows[0].id;        
            }
          }
          catch(e){
            return res.status(400).json({message:'Страхователь не изменен' + e.message});
          }
          try{
            await db.query(`update clients set
            strahovatel=$1,sobstvennik=$2,carcat=$3,number=$4,model=$5,power=$6,idtype=$7,idcode=$8,driverdata=$9,email=$10,phone=$11,price=$12,service=$13,date=$14,calltype=$15,time=$16,msg=$17
            where id=$18`,
            [strahovatel.id,sobstvennik.id,client.carCat,client.number,carId,client.power,client.idType,client.id,driverData,client.email,client.phone,client.price,client.service,client.date,oldClient.id]);
            return res.json({message:'Клиент изменен'});
          } catch(e){
            return res.status(400).json({message:'Не удалось изменить клиента' + e.message});
          }
        }
        if(oldClient.strahovatel!='' && oldClient!=undefined){
          try{
            await db.query(`update clients set
            strahovatel=$1,sobstvennik=$2,carcat=$3,number=$4,model=$5,power=$6,idtype=$7,idcode=$8,driverdata=$9,email=$10,phone=$11,price=$12,service=$13,date=$14,calltype=$15,time=$16,msg=$17
            where id=$18`,
            [1,sobstvennik.id,client.carCat,client.number,carId,client.power,client.idType,client.id,driverData,client.email,client.phone,client.price,client.service,client.date,oldClient.id]);
            return res.json({message:'Клиент изменен'});
          } catch(e){
            return res.status(400).json({message:'Не удалось изменить клиента' + e.message});
          }
        }
        else{
          try{
            await db.query(`update clients set
            strahovatel=$1,sobstvennik=$2,carcat=$3,number=$4,model=$5,power=$6,idtype=$7,idcode=$8,driverdata=$9,email=$10,phone=$11,price=$12,service=$13,date=$14,calltype=$15,time=$16,msg=$17
            where id=$18`,
            [1,sobstvennik.id,client.carCat,client.number,carId,client.power,client.idType,client.id,driverData,client.email,client.phone,client.price,client.service,client.date,oldClient.id]);
            return res.json({message:'Клиент изменен'});
          } catch(e){
            return res.status(400).json({message:'Не удалось изменить клиента' + e.message});
          }
        }
        break;
      }
      case (3):{
        const sobstvennik = {
          firstname:client.name,
          secondname:client.secondName,
          lastname:client.lastName
        };
        try{
          const sobstId = await db.query("update persons set firstname=$1,secondname=$2,lastname=$3 where id=$4 returning id",[...Object.values(sobstvennik),oldClient.sobstvennik]);
          sobstvennik.id = sobstId.rows[0].id;
        }
        catch(e){
          return res.status(400).json({message:'Собственник не изменен' + e.message});
        }
        try{
          await db.query(`update clients set
          carcat=$1,email=$2,phone=$3,price=$4,service=$5,date=$6,time=$7,callType=$8,msg=$9
          where id=$10`,
          [client.carCat,client.email,client.phone,client.price,client.service,client.date,client.time,client.callType,client.msg,oldClient.id]);
          return res.json({message:'Клиент изменен'});
        } catch(e){
          return res.status(400).json({message:'Не удалось изменить клиента' + e.message});
        }
      }
      case (4):{
        const sobstvennik = {
          firstname:client.name,
          secondname:client.secondName,
          lastname:client.lastName
        };
        try{
          const sobstId = await db.query("update persons set firstname=$1,secondname=$2,lastname=$3 where id=$4 returning id",[...Object.values(sobstvennik),oldClient.sobstvennik]);
          sobstvennik.id = sobstId.rows[0].id;
        }
        catch(e){
          return res.status(400).json({message:'Собственник не изменен' + e.message});
        }
        try{
          await db.query(`update clients set
          email=$1,phone=$2,price=$3,service=$4,date=$5,time=$6,callType=$7,msg=$8
          where id=$9`,
          [client.email,client.phone,client.price,client.service,client.date,client.time,client.callType,client.msg,oldClient.id]);
          return res.json({message:'Клиент изменен'});
        } catch(e){
          return res.status(400).json({message:'Не удалось изменить клиента' + e.message});
        }
      }
    }
  }
  // Удаление клиента. Т.к. у нас данные о страхователе и собственнике хранятся в отдельных от таблицы клиентов таблицах, то мы берем id этих страхователя и собственника
  // Чтобы затем удалить и их и не оставить никаких следов о то, что у нас был такой клиент. Также удаляются и все документы клиента (которые хрянятся по id пользователя)
  // Таким образом получаем в запросе id клиента и удаляются страхователь, собственник, пользователь, клиент и документы как из бд, так и файлы на сервере. Используется только в админке.
  async removeClient (req,res){
    const id = req.params.id;
    let personId,userId;
    try{
      personId = await db.query('select sobstvennik,strahovatel,email from clients where id=$1',[id]);
    } catch(e){
      return res.status(400).json({message:'Не найден клиент'+e.message});
    }
      personId = personId.rows[0];
    try{
      await db.query('delete from clients where id=$1',[id]);
      if(personId.strahovatel!=1){
        await db.query('delete from persons where id=$1',[personId.strahovatel]);
      }
      await db.query('delete from persons where id=$1', [personId.sobstvennik]);
    }
    catch(e){
      return res.status(400).json({message:'Не получилось удалить людей'+e.message});
    }
    try{
      userId = await db.query('select id from users where email=$1',[personId.email]);
      userId=userId.rows[0].id;
      await db.query('delete from docs where userid=$1',[userId]);
      await db.query('delete from users where id=$1',[userId]);
    }
    catch(e){
      return res.status(400).json({message:'Не найден такой пользователь'+e.message})
    }
      
      const dir = dirname(require.main.filename);
    try{
      fs.rmSync(`${dir}\\uploads\\${userId}`, { recursive: true, force: true });
    }
    catch(e){
        return res.status(400).json({message:'Не получилось удалить документы'+e.message});
    }
      return res.json({message:'Клиент удален'});
    }
}
module.exports = new ClientsController();