const db = require('../db');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const generator = require('generate-password');

class UserController {
  
  // Авторизация. Получаем имя, зашифрованный пароль, роль и id пользователя по email. bcrypt сравнивает правильный ли пароль (он зашифровывает полученный в запросе пароль и сравнивает его с тем,
  // что в БД). Если нормальный пароль, то присваиваем клиенту JWT токен и передаем обратно токен, имя, роль и id пользователя. (Используется в auth.hook.js)

  async getUser(req, res) {
    const {email,password} = req.body;
    let hash = await db.query("select (name),(hash_pwd),(role),(id) from users where email = $1",[email]);
    if(!hash.rows[0]){
      return res.status(400).json({message:'Пользователь не найден'});
    }
    const name = hash.rows[0].name;
    const role = hash.rows[0].role;
    const id = hash.rows[0].id;
    hash = hash.rows[0].hash_pwd;
    bcrypt.compare(password,hash, async function(err, result){
      if(result){
        const token = jwt.sign(
          {email},
          config.get('jwtSecret'),
          { expiresIn: '1h' }
          )
        await db.query("update users set token = ($1) where email = $2 returning *",[token,email]);
        return res.json({token,name,role,id});
      }
      return res.status(400).json({message:'Пароль неверный'});
    });
  }

  // Получение ID пользователя по его email. Используется при получении документов пользователя в админке (когда нужны документы выбранного пользователя)
  async getUserIdByEmail(req,res){
    const email = req.params.email;
    try{
      let id = await db.query('select id from users where email = $1', [email]);
      id = id.rows[0].id;
      return res.json({id});
    }
    catch(e){
      res.status(400).json({message:'Не получилось получить id пользователя' + e.message});
    }
  }

  // Регистрация новых пользователей для админки. Используется при создании клиента. Тут bcrypt зашифровывает пароль, а после этого заносит его в БД.

  async createUser(req,res){
    const {name,email, password} = req.body;
    bcrypt.hash(password,4, async function(err,hash){
      try{
        await db.query("insert into users(name,role,email,hash_pwd) values($1,$2,$3,$4) returning *",[name,1,email,hash]);
        return res.json({message:'Пользователь создан'});
      } catch(e){
        return res.status(400).json({message:'Пользователь с таким email уже существует'});
      }
    });
  }
  // Изменение данных клиента. Используется при изменении данных клиента, когда он меняет данные о страхователе, то меняется и имя, отображаемое в личном кабинете.
  async updateUser(req,res){
    const {name,email} = req.body;
    try{
      await db.query("update users set name=$1 where id=$2",[name,email]);
      return res.json({message:'Пользователь изменен'});
    } catch(e){
      return res.status(400).json({message:'Произошла ошибка в изменении клиента'+e.message});
    };
  }

  // Отправка сообщения с новым паролем на привязанный email, если забыл пароль. Генерируется случайный пароль длиной в 10 символов и отправляется на почту, которая была указана при регистрации.
  async sendPass(req,res){
    const email = req.params.email;
    let hash = await db.query("select (id) from users where email = $1",[email]);
    if(!hash.rows[0]){
      return res.status(400).json({message:'Пользователь не найден'});
    }
    const password = generator.generate({
      length:10,
      numbers: true
    });
    // Используется SMTP сервер GMail, т.е. данные отправляются с почты gmail. Возможно настроить и отправку сообщений с любого другого сервера.
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { // Данные пользователя нашей почты
        user: 't0pbigdata@gmail.com', // generated user
        pass: 'F0b0SuPaMiD@', // generated password
      },
    });
    bcrypt.hash(password,4, async function(err,hash){
      try{
        await db.query("update users set hash_pwd=$1 where email=$2",[hash,email]);
      }
      catch(e){
        return res.status(400).json({message:'Ошибка при смене пароля', error:e.message});
      }
      try{
        let info = await transporter.sendMail({
          from: '"Страхование" <t0pbigdata@gmail.com>', // sender address
          to: "89294384666@ya.ru", // list of receivers
          subject: "Новый пароль", // Subject line
          html: "Ваш новый пароль: "+ password, // html body
        });
        return res.json({message:'Письмо успешно отправлено'});
      } catch(e){
        return res.json({message:'Ошибка при отправке письма', error:e.message});
      }
    });
  }
}
module.exports = new UserController();