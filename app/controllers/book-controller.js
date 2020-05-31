'use strict';

const userService = require('./../services/user-service');
const bookService = require('./../services/book-service');
const authorService = require('./../services/author-service');
/**
 * Creates a new book and sets the response.
 *
 * @param request
 * @param response
 */
//creates a new book
exports.saveBook = (request, response) => {
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
                let saveBookPromise = bookService.save(request.body);
                saveBookPromise
                .then((book)=>{
                    let saveAuthorsPromise = authorService.save(request.body,book);
                    saveAuthorsPromise
                    .then((authors)=>{
                        console.log(authors)
                        result(book);
                    })
                    .catch(renderErrorResponse(response))  
                    // result(book);
                   
                })
                .catch(renderErrorResponse(response))  
                
            }

        })
    .catch(renderErrorResponse(response));
};
/**
 * get all my books sets the response.
 *
 * @param request
 * @param response
 */
//creates a new book
exports.getAllMyBooks = (request, response) => {
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
                const promiseBookBySeller = bookService.findBySellerId(val[0].id);
                promiseBookBySeller
                .then((books)=>{
                    result(books);
                    
                })
                .catch(renderErrorResponse(response))  
                
            }

        })
    .catch(renderErrorResponse(response));
}
/**
 * Delete book sets the response.
 *
 * @param request
 * @param response
 */
//creates a new book
exports.deleteBook = (request, response) => {
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
                console.log("param:"+request.params.bookid)
                const promiseDeleteBook = bookService.delete(request.params.bookid);
                promiseDeleteBook
                .then((books)=>{
                    result(books);
                    //  let authorPromise = bookService.addAuthorToProjects(book,request.body.book.authors)
                })
                .catch(renderErrorResponse(response))  
                
            }

        })
    .catch(renderErrorResponse(response));
}
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