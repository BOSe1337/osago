const { Pool } = require('pg');
const config = require('config');
//Создается поток, который может соединяться с бд с помощью данных, указанных в конфиге.
const pool = new Pool({
  user:config.get('postgreUser'),
  password:config.get('postgrePass'),
  host:config.get('postgreHost'),
  port:config.get('postgrePort'),
  database:config.get('postgreDB'),
})
module.exports = pool;