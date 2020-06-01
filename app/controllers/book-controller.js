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

                    let deleteAuthorPromise = authorService.deleteByBookId(book.insertId);
                    deleteAuthorPromise
                    .then((authors)=>{
                        let saveAuthorsPromise = authorService.save(request.body,book.insertId);
                        saveAuthorsPromise
                        .then((authors)=>{
                            result(book);
                        })
                        .catch(renderErrorResponse(response))  
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
                    let promiseBooks =[];
                    for(let b in books){
                       let tempPromise = authorService.findByBookAndAddAuthors(books[b]);
                       promiseBooks.push(tempPromise);
                    }
                    Promise.all(promiseBooks)
                    .then((values) => {
                        result(values)
                      })
                    .catch(renderErrorResponse(response));
                    // result(books);
                    

                    // let test = authorService.findByBookAndAddAuthors(books[15]);
                    // test.then((v)=>{
                    //     console.log(v)
                    // })
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
 * Get user and update book and sets the response.
 *
 * @param request
 * @param response
 */
//Update user profile
exports.updateBook = (request, response) => {
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
            console.log(request.body)
            let updateBookPromise = bookService.update(request.body,request.params.bookid);
            updateBookPromise
            .then((book)=>{
                let deleteAuthorPromise = authorService.deleteByBookId(request.params.bookid);
                deleteAuthorPromise
                .then((authors)=>{
                    let saveAuthorsPromise = authorService.save(request.body,request.params.bookid);
                    saveAuthorsPromise
                    .then((authors)=>{
                        result(book);
                    })
                    .catch(renderErrorResponse(response))  
                })
                .catch(renderErrorResponse(response))
               
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
exports.getAllOthersBooks = (request, response) => {
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
                const promiseBookBySeller = bookService.findByOtherSellers(val[0].id);
                promiseBookBySeller
                .then((books)=>{
                    let promiseBooks =[];
                    for(let b in books){
                       let tempPromise = authorService.findByBookAndAddAuthors(books[b]);
                       promiseBooks.push(tempPromise);
                    }
                    Promise.all(promiseBooks)
                    .then((values) => {
                        result(values)
                      })
                    .catch(renderErrorResponse(response));
                    // result(books);
                    

                    // let test = authorService.findByBookAndAddAuthors(books[15]);
                    // test.then((v)=>{
                    //     console.log(v)
                    // })
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