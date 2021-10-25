'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var calculateSubTotal = function calculateSubTotal(cartItem) {
  var subTotal = 0;
  var _cartItem$dataValues$ = cartItem.dataValues.Product,
      price = _cartItem$dataValues$.price,
      discountedPrice = _cartItem$dataValues$.discounted_price;
  var quantity = cartItem.dataValues.quantity;

  if (discountedPrice === '0.00') {
    subTotal = price * quantity;
  } else {
    subTotal = discountedPrice * quantity;
  }
  return subTotal.toFixed(2).toString();
};

var getCart = function getCart(cartItems) {
  var cart = [];
  cartItems.forEach(function (cartItem) {
    var subTotal = calculateSubTotal(cartItem);
    var itemDetails = {
      item_id: cartItem.dataValues.item_id,
      name: cartItem.dataValues.Product.dataValues.name,
      attributes: cartItem.dataValues.attributes,
      price: cartItem.dataValues.Product.price,
      quantity: cartItem.dataValues.quantity,
      product_id: cartItem.dataValues.Product.dataValues.product_id,
      sub_total: subTotal,
      added_on: cartItem.dataValues.added_on,
      discounted_price: cartItem.dataValues.Product.discounted_price
    };
    cart.push(itemDetails);
  });
  return cart;
};

exports.default = getCart;