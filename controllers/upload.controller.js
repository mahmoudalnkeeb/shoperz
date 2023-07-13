const uploadFile = require('../utils/firebaseStorage');
const Responser = require('../utils/responser');

const uploadProductImages = async (req, res, next) => {
  try {
    let urls = [];
    for (const file in req.files) {
      let url = await uploadFile(req.files[file], 'products');
      urls.push(url);
    }
    let responser = new Responser(201, 'uploaded successfully', { urls });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const uploadCategoryImage = async (req, res, next) => {
  try {
    let url = await uploadFile(req.file, 'categories');
    let responser = new Responser(201, 'uploaded successfully', { url });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};
module.exports = { uploadProductImages, uploadCategoryImage };
