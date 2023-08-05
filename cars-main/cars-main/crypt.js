const config = require('config');
const crypto = require('crypto');       // Библиотека, чтоб зашифровать все наши данные.
const fs = require('fs');               // Библиотека, чтобы обращаться к файловой системе операционной системы (в данном случае, чтобы сохранять и читать файлы)
class Crypt{
  // Шифрование. Функция crypto принимает в себя Алгоритм шифрования, секретный ключ и инициализирующий вектор, шифрует данные с помощью этих параметров, которые хранятся в конфиге.
  encrypt = (buffer) =>{
    const algorithm = config.get('cryptoAlg');
    const key = Buffer.from(config.get('cryptoKey'),'hex');
    const iv = Buffer.from(config.get('cryptoIv'),'hex');
    const cipher = crypto.createCipheriv(algorithm,key,iv);
    const result = Buffer.concat([cipher.update(buffer),cipher.final()]);
    return result;
  }
  decrypt = (encrypted)=>{
    const algorithm = config.get('cryptoAlg'); 
    const key = Buffer.from(config.get('cryptoKey'),'hex');
    const iv = Buffer.from(config.get('cryptoIv'),'hex');
    const decipher = crypto.createDecipheriv(algorithm,key,iv);
    const result = Buffer.concat([decipher.update(encrypted),decipher.final()]);
    return result;
  }
  // просто сохранение нашего зашифрованного файла
  saveEncryptedFile = (buffer,filepath) =>{
    const encrypted = this.encrypt(buffer);
    fs.writeFileSync(filepath,encrypted);
  }
  // Чтение зашифрованного файла и расшифровка его.
  getEncryptedFile = (filepath) => { 
    const encrypted = fs.readFileSync(filepath);
    const buffer = this.decrypt(encrypted);
    return buffer;
  }
}
module.exports = new Crypt();