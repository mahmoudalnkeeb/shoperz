const {
  getUserAddresses,
  getAddressById,
  createUserAddress,
  updateUserAddress,
  removeUserAddress,
} = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');
const addressRouter = require('express').Router();

addressRouter.get('/', authMiddleware, getUserAddresses);
addressRouter.post('/', authMiddleware, createUserAddress);
addressRouter.put('/:addressId', authMiddleware, updateUserAddress);
addressRouter.delete('/:addressId', authMiddleware, removeUserAddress);

// admin router
addressRouter.get('/:id', authMiddleware, getAddressById);

module.exports = addressRouter;
