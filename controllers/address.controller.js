const Address = require('../models/Address');
const Responser = require('../utils/responser');

const getUserAddresses = async (req, res, next) => {
  try {
    let userAddresses = await Address.find({ userId: req.userId });
    const responser = new Responser(200, 'user addresses fetched', { userAddresses });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while getting cart items'), error);
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
    next(new InternalError('Internal Error while getting cart items'), error);
  }
};

// TODO: check that address belongs to user first then make the change
const updateUserAddress = async (req, res, next) => {
  try {
    const responser = new Responser(200, 'user addresses fetched');
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while getting cart items'), error);
  }
};

const removeUserAddress = async (req, res, next) => {
  try {
    const responser = new Responser(200, 'user addresses fetched');
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while getting cart items'), error);
  }
};

module.exports = { getUserAddresses, createUserAddress,updateUserAddress, removeUserAddress };
