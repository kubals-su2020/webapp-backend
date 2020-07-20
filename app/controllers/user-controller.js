'use strict';

const userService = require('./../services/user-service');
const cartService = require('./../services/cart-service');
const tokenService = require('./../services/token-service');
const resetPasswordService = require('./../services/password-reset-sns-service');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
/**
 * Creates a new user and sets the response.
 *
 * @param request
 * @param response
 */
//creates a new user
exports.saveUser = (request, response) => {
    let startDate = new Date();
    logger.info('POST: new user',{label :"user-controller"})
    const result = (savedUser) => {
        let endDate   = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('users.post', seconds);
        response.status(200);
        response.json(savedUser);
    };

    bcrypt.hash(request.body.user.password, saltRounds, function(err, hash) {
        let user = {
            first_name : request.body.user.firstName,
            last_name : request.body.user.lastName,
            email : request.body.user.email,
            hashed_password : hash
        }
     
        const promise = userService.save(user);

        promise
            .then((val)=>{
                logger.info('New user: ' + user.first_name + ' '+ user.last_name + ' created ',{label :"user-controller"})
                cartService.save(val)
                result(val)
            })
            .catch(renderErrorResponse(response));
    });

};

/**
 * Login user and sets the response.
 *
 * @param request
 * @param response
 */
//login a user
exports.login = (request, response) => {
    let startDate = new Date();
    logger.info('POST: login user',{label :"user-controller"})
    let getUser;
    const promise =userService.findByUsername(request.body.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('user.post', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            // console.log(val)
            if(val.length < 1){
                logger.info('Authentication failed ',{label :"user-controller"})
                 response.status(401).json({
                    message: "Authentication failed"
                });
               
            }
            else{
               
                getUser = val[0];
                // console.log(val[0])
                 bcrypt.compare(request.body.user.password, val[0].hashed_password,function(err,res){
                    if(res){

                        let jwtToken = jwt.sign({
                            email: getUser.email,
                            userId: getUser.id
                        }, "longer-secret-is-better", {
                            expiresIn: "30d"
                        });
                        // console.log(jwtToken)
                        let tokenPromise = tokenService.save(jwtToken,getUser.id);
                        tokenPromise
                        .then((val)=>{
                            logger.info('User authenticated successfully ',{label :"user-controller"})
                            response.status(200).json({
                                token: jwtToken,
                                expiresIn: "30d",
                                msg: getUser
                            });
                        })
                        .catch(renderErrorResponse(response))

                    }
                    else{
                        logger.info('Authentication failed ',{label :"user-controller"})
                        response.status(401).json({
                            message: "Authentication failed"
                        });
                    }
                });
            }

        })
    .catch(renderErrorResponse(response));

};
/**
 * Get user profile and sets the response.
 *
 * @param request
 * @param response
 */
//Get user profile

exports.getProfile = (request, response) => {
    let startDate = new Date();
    const promise =userService.findByUsername(request.user);
    logger.info('GET: user profile ',{label :"user-controller"})
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('user.get', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found ',{label :"user-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            logger.info('User '+ val[0].first_name + ' '+ val[0].last_name+' found',{label :"user-controller"})
            result(val[0]);
        })
    .catch(renderErrorResponse(response));
};
/**
 * Get user and update profile and sets the response.
 *
 * @param request
 * @param response
 */
//Update user profile
exports.updateProfile = (request, response) => {
    let startDate = new Date();
    logger.info('PUT: update user profile  ',{label :"user-controller"})
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('user.put', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found ',{label :"user-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            let user = val[0];
            // console.log(request.body)
            // only update fields that were actually passed...
            if(typeof request.body.user.firstName !== 'undefined'){
                user.first_name = request.body.user.firstName;
            }
            if(typeof request.body.user.lastName !== 'undefined'){
                user.last_name = request.body.user.lastName;
            }
            if(typeof request.body.user.password !== 'undefined'){
                // console.log("1")
                user.hashed_password = request.body.user.password;
                bcrypt.hash(user.hashed_password, saltRounds, function(err, hash) {
                    // console.log(user.hashed_password)
                    let user1 = {
                        id: user.id,
                        first_name : user.first_name,
                        last_name : user.last_name,
                        email : user.email,
                        hashed_password : hash
                    }
                    const promiseUpdate = userService.update(user1);
                    promiseUpdate
                    .then((val)=>{
                        logger.info('User first name updated successfully to '+ user1.first_name,{label :"user-controller"})
                        logger.info('User last name updated successfully to '+ user1.last_name,{label :"user-controller"})
                        result(val[0]);
                    })
                    .catch(renderErrorResponse(response))
                });
            }
            else{
                // console.log("2")
                let user1 = {
                    id: user.id,
                    first_name : user.first_name,
                    last_name : user.last_name,
                    email : user.email
                }
                const promiseUpdate = userService.updateFew(user1);
                promiseUpdate
                .then((val)=>{
                    logger.info('User first name updated successfully to '+ user1.first_name,{label :"user-controller"})
                    logger.info('User last name updated successfully to '+ user1.last_name,{label :"user-controller"})
                    result(val[0]);
                })
                .catch(renderErrorResponse(response))
            }

        })
    .catch(renderErrorResponse(response));
};


/**
 * logout user and sets the response.
 *
 * @param request
 * @param response
 */
//logout a new user
exports.logout = (request, response) => {
    let startDate = new Date();
    logger.info('POST: logout user',{label :"user-controller"})
    const result = (savedUser) => {
        let endDate   = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('user.logout', seconds);
        response.status(200);
        response.json({"msg":"User logged out successfully!"});
    };
    let logoutTokenPromise = tokenService.deleteTokenUserId(request.user.userId);
    logoutTokenPromise
    .then((val)=>{
        result();
    })
    .catch(renderErrorResponse(response))
};

/**
 * Send reset password link sets the response.
 *
 * @param request
 * @param response
 */
//send reset password link
exports.resetPassword = (request, response) => {
    let startDate = new Date();
    logger.info('POST: send reset password link',{label :"user-controller"})
    const result = (savedUser) => {
        let endDate   = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('user.resetpassword', seconds);
        response.status(200);
        response.json({"msg":"Reset password link sent successfully!"});
    };
    let userPromise = userService.findByUsername(request.body.user);
    userPromise
    .then((val)=>{
        if(val.length < 1){
            console.log("not found")
            logger.info('Email address not found ',{label :"user-controller"})
             response.status(200).json({
                message: "Email address not found"
            });
        }
        else{
            require('crypto').randomBytes(32, function(ex, buf) {
                let token = buf.toString('hex');
                console.log(token)
                let resetPasswordPromise = resetPasswordService.resetPassword(request.body.user,token);
                // resetPasswordPromise
                // .then((rs)=>{
                //     console.log(rs)
                // })
                // .catch(renderErrorResponse(response))
            });
            // token = crypto.randomBytes(32).toString('hex')
            // console.log(token)
        }
        // result();
    })
    .catch(renderErrorResponse(response))
};


/**
 * Throws error if error object is present.
 *
 * @param {Response} response The response object
 * @return {Function} The error handler function.
 */
let renderErrorResponse = (response) => {
    const errorCallback = (error) => {
        if (error) {
            logger.error(error.message,{label :"user-controller"})
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};