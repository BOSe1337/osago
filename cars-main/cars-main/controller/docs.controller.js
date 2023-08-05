const db = require('../db');
const config = require('config');
const multer = require('multer');
const fs = require('fs');
const {promisify}= require('util');
const {dirname} = require('path');
const crypt = require('../crypt');
const dir = dirname(require.main.filename);
const mime = require('mime');
const stream = require('stream');
class DocsController {
  // Загрузка файла. В запросе получается id Пользователя и название файла. Файл шифруется с помощью crypto (модуль crypt.js в корне, там подробнее описан процесс шифрования). В случае, если
  // файл уже существует, то файл не перезаписывается, а отправляется сообщение на клиент, что такой файл уже существует. Также в БД добавляется информация о новом файле у текущего пользователя
  async uploadFile(req,res){
    if(req.error) return res.status(400).json({message:'Файл уже существует'});
    const id = parseInt(req.body.text[1]);
    const filename = req.body.text[0] +'.'+mime.getExtension(req.file.mimetype);
    const filepath = `${dir}\\uploads\\${id}\\`;
    if(!fs.existsSync(filepath)) fs.mkdirSync(filepath);
    crypt.saveEncryptedFile(req.file.buffer,`${filepath}\\${filename}`);
    const respond = await db.query('insert into docs(userid,path,name) values ($1,$2,$3)',[id,filepath,filename]);
    return res.json({message:"Файл сохранен"});
  }
  // Получение массива всех документов пользователя, чтобы отображать их во вкладке "ваши документы".
  async fetchFileArray(req,res){
    const id = req.params.id;
    try{
      let images = await db.query('select path,name from docs where userId=$1',[id]);
      images = images.rows;
      const imageArray=[];
      images.forEach(value => {
        imageArray.push(`${value.name}`);
      })
      return res.json(imageArray);
    }
    catch(e){
      return res.status(400).json({message:'Произошла ошибка при получении документов'+e.message});
    }
  } 
  // Получение изображение для вывода его на экран в виде миниатюры.
  async fetchImage(req,res){
    const name = req.params.name;
    const id = req.params.id;
    const buffer = crypt.getEncryptedFile(`${dir}\\uploads\\${id}\\${name}`);
    const extPos= name.lastIndexOf('.'); // Чтобы найти какое расширение у файла, чтобы задать нужный заголовок в запросе в зависимости от типа файла
    let ext = name.substring(extPos+1);
    const readStream = new stream.PassThrough(); // Так как у нас расшифрованный файл нигде не сохраняется, то делаем поток чтения. И потом это всё заливаем в виде последовательности байтов в наш запрос
    readStream.end(buffer);
    const contentType = ext=='jpeg'? 'image/jpeg' : 'application/pdf';
    res.writeHead(200,{
      "Content-Type": contentType,
      "Content-Length": buffer.length
    })
    res.end(buffer);
  }
  // Тоже получение изображения, однако в этом случае сервер говорит клиенту, что его надо скачать. Используется если клиент нажимает на название файла, чтобы клиенту предложили его скачать.
  async downloadImage(req,res){
    const name = req.params.name;
    const id = req.params.id;
    const buffer = crypt.getEncryptedFile(`${dir}\\uploads\\${id}\\${name}`);
    const extPos= name.lastIndexOf('.');
    let ext = name.substring(extPos+1);
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    const contentType = ext=='jpeg'? 'image/jpeg' : 'application/pdf';
    res.writeHead(200,{
      "Content-Disposition": "attachment; filename="+encodeURI(name),
      "Content-Type": contentType,
      "Content-Length": buffer.length
    })
    res.end(buffer);
  }
  // Удаление файла с сервера. Удаляется сначала из базы данных, затем и с хранилища.
  async removeDoc(req,res){
    const unlinkAsync = promisify(fs.unlink);
    const name = req.params.name;
    const id = req.params.id;
    try{
      const respond = await db.query('delete from docs where userid=$1 and name=$2',[id,name]);
    }
    catch(e){
      res.status(400).json({message:'Такого файла нет' + e.message})
    }
    await unlinkAsync(`${dir}\\uploads\\${id}\\${name}`);
    res.json({message:'Doc Removed'});
  }
}
module.exports = new DocsController();