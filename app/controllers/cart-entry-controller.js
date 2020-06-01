'use strict';

const userService = require('./../services/user-service');
const cartEntryService = require('./../services/cart-entry-service');
const cartService = require('./../services/cart-service');
const bookService = require('./../services/book-service');
/**
 * Get cart and update cart and sets the response.
 *
 * @param request
 * @param response
 */
//Update user cart
exports.updateCart = (request, response) => {
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
            else{
                //  console.log(val[0])
                const cartEntryPromise = cartEntryService.save(request.body);
                cartEntryPromise
                .then((cart)=>{
                    result(cart)
                })
                .catch(renderErrorResponse(response))
            }
        })
    .catch(renderErrorResponse(response));
};

/**
 * Get cart entries for a user and sets the response.
 *
 * @param request
 * @param response
 */
//Get cart for user

exports.getCartByUserId = (request, response) => {
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
            //  console.log(request.body)
            const cartServicePromise = cartService.getCartByUserId(val[0])
            cartServicePromise
            .then((cart)=>{
                // console.log(cart[0])
                const cartEntryPromise = cartEntryService.getCartByCartId(cart);
                cartEntryPromise
                .then((cartEntries)=>{
                    // console.log(cartEntries)
                    result(cartEntries)
                })
                .catch(renderErrorResponse(response))
            })
            .catch(renderErrorResponse(response))

    })
    .catch(renderErrorResponse(response))
};







/**
 * Get cart entries for a user and sets the response.
 *
 * @param request
 * @param response
 */
//Get cart for user

exports.getCartBookDetailsByUserId = (request, response) => {
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
            //  console.log(request.body)
            const cartServicePromise = cartService.getCartByUserId(val[0])
            cartServicePromise
            .then((cart)=>{
                const cartEntryPromise = cartEntryService.getCartByCartId(cart);
                cartEntryPromise
                .then((cartEntries)=>{
                    let promiseCartBooks =[];
                    for(let c in cartEntries){
                       let tempPromise = bookService.findByBookInCartAndAdd(cartEntries[c]);
                       promiseCartBooks.push(tempPromise);
                    }
                    Promise.all(promiseCartBooks)
                    .then((values) => {
                        result(values)
                      })
                    .catch(renderErrorResponse(response));
                })
                .catch(renderErrorResponse(response))
            })
            .catch(renderErrorResponse(response))

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
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};







// const cartEntryPromise = cartEntryService.save(request.body);
// cartEntryPromise
// .then((cart)=>{
//     let promiseCartBooks =[];
//     for(let c in cart){
//        let tempPromise = bookService.findByBookInCartAndAdd(cart[c]);
//        promiseCartBooks.push(tempPromise);
//     }
//     Promise.all(promiseCartBooks)
//     .then((values) => {
//         result(values)
//       })
//     .catch(renderErrorResponse(response));
// })
// .catch(renderErrorResponse(response))