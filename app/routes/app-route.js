'use strict';

const userController = require('./../controllers/user-controller');
const bookController = require('./../controllers/book-controller');
const cartEntryController = require('./../controllers/cart-entry-controller');
const authorize = require("../middlewares/auth");
//API's for routing to a specified request
module.exports = (app) => {
    app.route('/users')
        .post(userController.saveUser)
    app.route('/user')
        .post(userController.login)
        .get(authorize,userController.getProfile)
        .put(authorize,userController.updateProfile)
    app.route('/book')
        .post(authorize,bookController.saveBook)
    app.route('/books/seller')
        .get(authorize,bookController.getAllMyBooks)
    app.route('/books/seller/:bookid')
        .delete(authorize,bookController.deleteBook)
        .put(authorize,bookController.updateBook)
    app.route('/books/others')
        .get(authorize,bookController.getAllOthersBooks)
    app.route('/cart')
        .put(authorize,cartEntryController.updateCart)
        .get(authorize,cartEntryController.getCartByUserId)
    app.route('/cart/details')
        .get(authorize,cartEntryController.getCartBookDetailsByUserId);
};