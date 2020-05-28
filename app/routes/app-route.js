'use strict';

const userController = require('./../controllers/user-controller');
const authorize = require("../middlewares/auth");
//API's for routing to a specified request
module.exports = (app) => {
    app.route('/users')
        .post(userController.saveUser)
    app.route('/user')
        .post(userController.login)
        .get(authorize,userController.getProfile)
        .put(authorize,userController.updateProfile);

};