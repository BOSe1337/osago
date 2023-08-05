const db = require('../db');
const config = require('config');

class CarsController {
  
  // Получение моделей автомобилей для выпадающих списков

  async getMarks(req, res) {
    try{
      const cars = await db.query("select distinct on (mark) mark from models");
      return res.json(cars.rows);
    }
    catch(e){
      return res.json({message:'Не найдено марок автомобилей', error:e.message});
    }
  }

  // Получение моделей для конкретной марки
  
  async getModels(req,res){
    const mark = req.params.mark;
    try{
      const models = await db.query("select distinct on (model) model from models where mark = $1",[mark]);
      return res.json(models.rows);
    }
    catch(e){
      return res.json({message:'Не найдено моделей', error: e.message});
    }
  }
}
module.exports = new CarsController();