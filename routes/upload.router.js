const multer = require('multer');
const { uploadProductImages, uploadCategoryImage } = require('../controllers/upload.controller');
const authorize = require('../middlewares/authorization');
const authMiddleware = require('../middlewares/authentication');
const uploadRouter = require('express').Router();
const upload = multer();

uploadRouter.post(
  '/product',
  authMiddleware,
  authorize('ADMIN'),
  upload.array('product-image', 6),
  uploadProductImages
);
uploadRouter.post(
  '/category',
  authMiddleware,
  authorize('ADMIN'),
  upload.single('category-image'),
  uploadCategoryImage
);

module.exports = uploadRouter;
