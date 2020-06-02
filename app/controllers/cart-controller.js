'use strict';

const userService = require('./../services/user-service');
const bookService = require('./../services/book-service');
const authorService = require('./../services/author-service');
const cartEntryService = require('./../services/cart-entry-service');
/**
 * Creates a new book and sets the response.
 *
 * @param request
 * @param response
 */
//creates a new book
exports.saveCart = (request, response) => {
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
                let promiseBooks =[];
                let cart = request.body.cart;
                for(let cartEntry in cart){
                    let tempPromise = bookService.findByBookId(cart[cartEntry]);
                    promiseBooks.push(tempPromise);
                }
                Promise.all(promiseBooks)
                    .then((booksInCart) => {
                        let errorMsg = [];
                        for(let c in booksInCart){
                            if(booksInCart[c].bookWithSeller.quantity < booksInCart[c].quantity){
                                errorMsg.push(booksInCart[c].bookWithSeller)
                            }
                        }
                        if(errorMsg.length>0){
                            return response.status(200).json({
                                message: { error : errorMsg }
                            });
                        }
                        else{
                            let promiseAllBooksUpdateQuantity = [];
                            for(let cartEntry in booksInCart){
                                // console.log(booksInCart[cartEntry])
                                 let updateBookQuantityPromise = bookService.updateBookQuantity(booksInCart[cartEntry]);
                                 promiseAllBooksUpdateQuantity.push(updateBookQuantityPromise);
                            }
                            Promise.all(promiseAllBooksUpdateQuantity)
                            .then((allBooksUpdateResult)=>{
                                let promiseCartEntrySubmitAndRemove = [];
                                for(let cartEntry in booksInCart){
                                    let updateCartBookQuantityPromise = cartEntryService.deleteEntryFromCart(booksInCart[cartEntry]);
                                    promiseCartEntrySubmitAndRemove.push(updateCartBookQuantityPromise);
                                }
                                Promise.all(promiseCartEntrySubmitAndRemove)
                                .then((finalResult)=>{
                                    // console.log(finalResult);
                                    result({
                                        message : {
                                            "success" : "Cart submitted successfully!"
                                        }
                                    })
                                })
                                .catch(renderErrorResponse(response))
                            })
                            .catch(
                                renderErrorResponse(response)
                            )

                        }
                      })
                    .catch(renderErrorResponse(response));
            }

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