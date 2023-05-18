const { Cart } = require('../models/Cart');

const createOrderFromUserCart = async (userId , address , paymentMethod) => {
  try {
    // get cart by userId
    let userCart = await Cart.findOne({ userId });
    let cartTotal = await userCart.getCartTotal()
    let cartTotalDiscounted = await userCart.getCartDiscountedTotal()
    // use cart data to create new order 

    // wait for payment in case of not cash_on_delivery

    
  } catch (error) {
    throw error;
  }
};
