const multer = require('multer');
const { uploadProductImages, uploadCategoryImage } = require('../controllers/upload.controller');
const authorize = require('../middlewares/authorization');
const uploadRouter = require('express').Router();
const upload = multer();

uploadRouter.post('/product', authorize('ADMIN'), upload.array('product-image', 6), uploadProductImages);
uploadRouter.post('/category', authorize('ADMIN'), upload.single('category-image'), uploadCategoryImage);

module.exports = uploadRouter;
