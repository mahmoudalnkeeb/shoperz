const {
  getUserAddresses,
  getAddressById,
  createUserAddress,
  updateUserAddress,
  removeUserAddress,
} = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/authentication');
const addressRouter = require('express').Router();

addressRouter.get('/', authMiddleware, getUserAddresses);
addressRouter.get('/:id', authMiddleware, getAddressById );
addressRouter.post('/', authMiddleware, createUserAddress);
addressRouter.put('/:addressId', authMiddleware, updateUserAddress);
addressRouter.delete('/:addressId', authMiddleware, removeUserAddress);

module.exports = addressRouter;
