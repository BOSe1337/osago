const express = require('express');
const router = express.Router();
const DocsController = require('../controller/docs.controller');
const {check, validationResult} = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime');
const {dirname} = require('path');
const dir = dirname(require.main.filename);
// const storage = multer.diskStorage({
//   destination: function (req,file,cb){
//     let path = dir +'\\uploads\\'+req.body.text[1]+'\\';

//     if(!fs.existsSync(path)) fs.mkdirSync(path);
//     file.path=path;
//     cb(null,path);
//   },
//   filename: function (req,file,cb) {
//     cb(null,req.body.text[0] + '.' + mime.getExtension(file.mimetype));
//   }
// })
const storage = multer.memoryStorage();
const fileFilter = (req,file,callback) => {
  const filename = req.body.text[0] + '.' + mime.getExtension(file.mimetype);
  if (fs.existsSync(dir + '\\uploads\\' + req.body.text[1]+'\\' + filename)) {
    req.error = `File ${filename} is already uploaded!`;
    callback(null,false);
} else {
    callback(null, true);
}
}
const upload = multer({storage,fileFilter});

router.post('/upload',upload.single('file'),DocsController.uploadFile);
router.get('/:id',DocsController.fetchFileArray);
router.get('/image/:id/:name',DocsController.fetchImage);
router.get('/download/image/:id/:name',DocsController.downloadImage);
router.get('/delete/:id/:name', DocsController.removeDoc);

module.exports = router;