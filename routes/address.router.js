const {
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  removeUserAddress,
} = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/authentication');

const addressRouter = require('express').Router();

addressRouter.get('/', authMiddleware, getUserAddresses);
addressRouter.post('/', authMiddleware, createUserAddress);
addressRouter.put('/', authMiddleware, updateUserAddress);
addressRouter.delete('/', authMiddleware, removeUserAddress);

module.exports = addressRouter;
