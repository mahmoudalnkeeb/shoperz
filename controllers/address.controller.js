const Address = require('../models/Address');
const Responser = require('../utils/responser');
const { InternalError, NotFoundError } = require('../middlewares/errorhandler');

const getAddressById = async (req, res, next) => {
  try {
    let { id } = req.params;
    let address = await Address.findById(id);
    if (!address) return next(new NotFoundError('No address found with this id ' + id));
    const responser = new Responser(200, 'address fetched', { address });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while getting address by id'), error);
  }
};

const getUserAddresses = async (req, res, next) => {
  try {
    let userAddresses = await Address.find({ userId: req.userId });
    const responser = new Responser(200, 'user addresses fetched', { userAddresses });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while getting addresses'), error);
  }
};

const createUserAddress = async (req, res, next) => {
  try {
    let address = req.body;
    address.userId = req.userId;
    // check if new address checked as default to reset other default address and create new default one
    if (address.default == true && typeof address.default == 'boolean') {
      await Address.resetDefault();
    }
    let userAddress = await Address.create([address]);
    const responser = new Responser(200, 'user addresses fetched', { userAddress });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while creating address'), error);
  }
};

// TODO: check that address belongs to user first then make the change
const updateUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const modifiedAddress = req.body;
    const updatedAddress = Address.selectAndUpdateAddress(req.userId, addressId, modifiedAddress);
    const responser = new Responser(200, 'updated user address ', updatedAddress);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const removeUserAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = Address.selectAndDeleteAddress(req.userId, addressId);
    const responser = new Responser(200, 'user address deleted', deletedAddress);
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while removing address'), error);
  }
};

module.exports = {
  getAddressById,
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  removeUserAddress,
};
