'use strict';

const userService = require('./../services/user-service');
const bookService = require('./../services/book-service');
const authorService = require('./../services/author-service');
const imageService = require('./../services/image-service');
const uploadImageService = require('./../services/upload-image');
// const getImage = require('./../services/upload-image');
// const uploadFile = upload.array('image',30);

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
                            let sellerId = request.body.book.seller.id;
                            let bookId = book.insertId;
                            for(let i in request.body.book.imageData){
                                request.body.book.imageData[i].metadata.newName
                                     = sellerId + "_" + bookId + "_" 
                                        + Date.now()
                                        + "_" + i
                                        + "_" + request.body.book.imageData[i].metadata.name;
                                // console.log(request.body.book.imageData[i].metadata)
                            }
                            let saveImages = imageService.save(request.body,book.insertId)
                            saveImages.then((bookImgs)=>{
                                let images = [];
                                for (let i in request.body.book.imageData){
                                    // var string = request.body.book.imageData[i].image;
                                    // // console.log(string)
                                    // var buffer = Buffer.from(string, 'utf-8');
                                    // console.log(buffer)
                                    // var uploadPromise =[];
                                    // uploadImageService.uploadFile(buffer,request.body.book.imageData[i].metadata.newName);
                                    uploadImageService.uploadFile(request.body.book.imageData[i].image
                                        ,request.body.book.imageData[i].metadata.newName
                                        ,request.body.book.imageData[i].metadata.type);
                                }
                                result(book);
                            })
                             
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

                const getImagesOfBook =  imageService.findByBookId(request.params.bookid);
                getImagesOfBook
                .then((images)=>{
                    let deleteImagesPromise = [];
                    for(let i in images){
                        deleteImagesPromise.push(uploadImageService.deleteImage(images[i].name))
                    }
                    Promise.all(deleteImagesPromise)
                    .then((deleteImage) => {
                        const promiseDeleteBook = bookService.delete(request.params.bookid);
                        promiseDeleteBook
                        .then((books)=>{
                            result(books);
                            //  let authorPromise = bookService.addAuthorToProjects(book,request.body.book.authors)
                        })
                        .catch(renderErrorResponse(response)) 
                      })
                    .catch(renderErrorResponse(response));
 
                })

                
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
            // console.log(request.body)
            let updateBookPromise = bookService.update(request.body,request.params.bookid);
            updateBookPromise
            .then((book)=>{
                let deleteAuthorPromise = authorService.deleteByBookId(request.params.bookid);
                deleteAuthorPromise
                .then((authors)=>{
                    let saveAuthorsPromise = authorService.save(request.body,request.params.bookid);
                    saveAuthorsPromise
                    .then((authors)=>{
                        // console.log(request.body)

                        let sellerId = request.body.book.sellerId;
                        let bookId = request.body.book.id;
                        for(let i in request.body.book.imageData){
                            request.body.book.imageData[i].metadata.newName
                                 = sellerId + "_" + bookId + "_" 
                                    + Date.now()
                                    + "_" + i
                                    + "_" + request.body.book.imageData[i].metadata.name;
                        }
                        let saveImages = imageService.save(request.body,bookId)
                        saveImages.then((bookImgs)=>{
                            let images = [];
                            for (let i in request.body.book.imageData){
                                uploadImageService.uploadFile(request.body.book.imageData[i].image
                                    ,request.body.book.imageData[i].metadata.newName
                                    ,request.body.book.imageData[i].metadata.type);
                            }
                            result(book);
                        })
                        // result(book);
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
    // console.log("ok1")
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
                    // console.log(books)
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
 * get all my books sets the response.
 *
 * @param request
 * @param response
 */
//gets Images of a book
exports.getBookImages = (request, response) =>{
    const promise =imageService.findByBookId(request.params.bookid);
    
    const result = (res) => {
        response.status(200);
        response.json(res);
        // res.writeHead(200, {'Content-Type': 'image/jpeg'});
        // res.write(data.Body, 'binary');
        // res.end(null, 'binary');
    };

    promise
    .then((val)=>{
            if(val.length < 1){
                return response.status(404).json({
                    message: "Book not found"
                });
            }
            else{
                let imagesFetchedPromise = [];
                for(let i in val){
                    let name = val[i].name;
                    imagesFetchedPromise.push(uploadImageService.getImage(name));
                }
                Promise.all(imagesFetchedPromise)
                .then((values) => {
                    // console.log(values)
                    result(values)
                  })
                .catch(renderErrorResponse(response));
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