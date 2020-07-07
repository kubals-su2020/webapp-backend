'use strict';

const userService = require('./../services/user-service');
const cartEntryService = require('./../services/cart-entry-service');
const cartService = require('./../services/cart-service');
const bookService = require('./../services/book-service');
const authorService = require('./../services/author-service');
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
/**
 * Get cart and update cart and sets the response.
 *
 * @param request
 * @param response
 */
//Update user cart
exports.updateCart = (request, response) => {
    let startDate = new Date();
    logger.info("PUT: update entries in cart",{label :"cart-entry-controller"})
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('cart.put', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found',{label :"cart-entry-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            else{
                //  console.log(val[0])
                const cartEntryPromise = cartEntryService.save(request.body);
                cartEntryPromise
                .then((cart)=>{
                    logger.info('Cart: ' + request.body.buyer.id+ ' updated successfully for book:'+request.body.book.id,{label :"cart-entry-controller"})
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
    // console.log("get cart")
    let startDate = new Date();
    logger.info('GET : cart of logged in user',{label :"cart-entry-controller"})
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('cart.get', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found',{label :"cart-entry-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            //  console.log(request.body)
            const cartServicePromise = cartService.getCartByUserId(val[0])
            cartServicePromise
            .then((cart)=>{
                //  console.log(cart[0])
                logger.info('Cart id found for user id:'+val[0].id,{label :"cart-entry-controller"})
                const cartEntryPromise = cartEntryService.getCartByCartId(cart);
                cartEntryPromise
                .then((cartEntries)=>{
                    // console.log(cartEntries)
                    logger.info('successfully found entries in cart: '+cart[0].id,{label :"cart-entry-controller"})
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
    let startDate = new Date();
    logger.info('GET: cart book details',{label :"cart-entry-controller"})
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('cart.details.get', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found',{label :"cart-entry-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            //  console.log(request.body)
            const cartServicePromise = cartService.getCartByUserId(val[0])
            cartServicePromise
            .then((cart)=>{
                logger.info('Cart id found for user id:'+val[0].id,{label :"cart-entry-controller"})
                const cartEntryPromise = cartEntryService.getCartByCartId(cart);
                cartEntryPromise
                .then((cartEntries)=>{
                    logger.info('Cart entries fetched for cart: '+cart[0].id,{label :"cart-entry-controller"})
                    let promiseCartBooks =[];
                    for(let c in cartEntries){
                       let tempPromise = bookService.findByBookInCartAndAdd(cartEntries[c]);
                       promiseCartBooks.push(tempPromise);
                    }
                    Promise.all(promiseCartBooks)
                    .then((bookDetails) => {
                        let promiseBooks =[];
                        for(let b in bookDetails){
                           let tempPromise2 = authorService.findByBookAndAddAuthorsV2(bookDetails[b]);
                           promiseBooks.push(tempPromise2);
                        }
                        Promise.all(promiseBooks)
                        .then((values) => {
                            logger.info('Cart book details found successfully',{label :"cart-entry-controller"})
                            result(values)
                          })
                        .catch(renderErrorResponse(response));


                        // result(values)
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
        logger.error(error.message,{label :"cart-entry-controller"})
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