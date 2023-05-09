const multer = require('multer');
const uploadProductImages = require('../controllers/upload.controller');
const uploadRouter = require('express').Router();
const upload = multer();

uploadRouter.post('/product', upload.array('product-image' , 6), uploadProductImages);
module.exports = uploadRouter;
