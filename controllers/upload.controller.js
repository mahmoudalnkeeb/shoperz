const { uploadFile } = require('../utils/firebaseStorage');
const Responser = require('../utils/responser');

const uploadProductImages = async (req, res, next) => {
  try {
    let images = [];
    for (const file in req.files) {
      let url = await uploadFile(req.files[file], 'products');
      images.push(url);
    }
    let responser = new Responser(201, 'uploaded successfully', { images });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const uploadCategoryImage = async (req, res, next) => {
  try {
    let image = await uploadFile(req.file, 'categories');
    let responser = new Responser(201, 'uploaded successfully', { image });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};
module.exports = { uploadProductImages, uploadCategoryImage };
