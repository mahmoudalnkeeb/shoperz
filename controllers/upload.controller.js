const uploadFile = require('../utils/firebaseStorage');

const uploadProductImages = async (req, res, next) => {
  try {
    let urls = [];
    for (const file in req.files) {
      let url = await uploadFile(req.files[file], 'products');
      urls.push(url);
    }
    res.status(200).json(urls);
  } catch (error) {
    next(error);
  }
};

module.exports = uploadProductImages;
