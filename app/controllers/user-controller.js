'use strict';

const userService = require('./../services/user-service');
const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');
const saltRounds = 10;
/**
 * Creates a new user and sets the response.
 *
 * @param request
 * @param response
 */
//creates a new user
exports.saveUser = (request, response) => {

    const result = (savedUser) => {
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
            .then(result)
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
    let getUser;
    const promise =userService.findByUsername(request.body.user);
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            console.log(val)
            if(val.length < 1){

                 response.status(401).json({
                    message: "Authentication failed"
                });
               
            }
            else{
               
                getUser = val[0];
                 bcrypt.compare(request.body.user.password, val[0].hashed_password,function(err,res){
                    if(res){

                        let jwtToken = jwt.sign({
                            email: getUser.email,
                            userId: getUser._id
                        }, "longer-secret-is-better", {
                            expiresIn: "30d"
                        });
                        response.status(200).json({
                            token: jwtToken,
                            expiresIn: "30d",
                            msg: getUser
                        });
                    }
                    else{
                        
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
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                return response.status(404).json({
                    message: "User not found"
                });
            }
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
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                return response.status(404).json({
                    message: "User not found"
                });
            }
            let user = val[0];
            
            // only update fields that were actually passed...
            if(typeof request.body.user.firstName !== 'undefined'){
                user.first_name = request.body.user.firstName;
            }
            if(typeof request.body.user.lastName !== 'undefined'){
                user.last_name = request.body.user.lastName;
            }
            if(typeof request.body.user.password !== 'undefined'){
                user.hashed_password = request.body.user.password;
            }
            bcrypt.hash(user.hashed_password, saltRounds, function(err, hash) {
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
                    result(val[0]);
                })
                .catch(renderErrorResponse(response))
            });

        })
    .catch(renderErrorResponse(response));
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
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};