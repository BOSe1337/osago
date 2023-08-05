const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const {check, validationResult} = require('express-validator');

router.post('/check',
[
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 6 символов').isLength({min:6})
], userController.getUser);
router.post('/create',
[
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 6 символов').isLength({min:6})
], userController.createUser);
router.get('/getidbyemail/:email',userController.getUserIdByEmail);
router.post('/update',
[
  check('email', 'Некорректный email').isEmail(),
  check('password', 'Минимальная длина пароля 6 символов').isLength({min:6})
], userController.updateUser);
router.get('/:email', userController.sendPass);

module.exports = router;