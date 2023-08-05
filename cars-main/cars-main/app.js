const express = require('express');
const config = require('config'); // В config хранятся все наши переменные по типу секретных ключей, данных для подключения к БД и все такое.
const db = require('./db'); // Тут у нас подключается к БД
const carsRouter = require('./routes/cars.routes');         // Этот роутер определяет что делать, если обратились по запросу /api/cars
const clientRouter = require('./routes/clients.routes');    // Этот роутер определяет что делать, если обратились по запросу /api/clients
const userRouter = require('./routes/users.routes');        // Этот роутер определяет что делать, если обратились по запросу /api/users
const docsRouter = require('./routes/docs.routes');         // Этот роутер определяет что делать, если обратились по запросу /api/docs
const app = express();
// Порт на котором работает приложение
const PORT = config.get('port') || 5000;

function start() {
  try{
    app.use(express.json());
    app.use('/api/cars',carsRouter);
    app.use('/api/clients',clientRouter);
    app.use('/api/users',userRouter);
    app.use('/api/docs',docsRouter);
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}
start();