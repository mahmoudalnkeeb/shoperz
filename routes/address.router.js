const {
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  removeUserAddress,
} = require('../controllers/address.controller');
const authMiddleware = require('../middlewares/authentication');

const addressRouter = require('express').Router();

/**
 * Get user addresses
 *
 * @route GET /address
 * @middleware authMiddleware - Middleware function for authentication
 * @handler getUserAddresses - Handler function for retrieving user addresses
 * @access Public
 */
addressRouter.get('/', authMiddleware, getUserAddresses);

/**
 * Create a user address
 *
 * @route POST /address
 * @middleware authMiddleware - Middleware function for authentication
 * @handler createUserAddress - Handler function for creating a user address
 * @access Private
 */
addressRouter.post('/', authMiddleware, createUserAddress);

/**
 * Update a user address
 *
 * @route PUT /address
 * @middleware authMiddleware - Middleware function for authentication
 * @handler updateUserAddress - Handler function for updating a user address
 * @params /addressId
 * @body { modified address data }
 * @access Private
 */
addressRouter.put('/:addressId', authMiddleware, updateUserAddress);

/**
 * Remove a user address
 *
 * @route DELETE /address
 * @middleware authMiddleware - Middleware function for authentication
 * @handler removeUserAddress - Handler function for removing a user address
 * @params /addressId
 * @body {none}
 * @access Private
 */
addressRouter.delete('/:addressId', authMiddleware, removeUserAddress);

module.exports = addressRouter;
