'use strict';

const userService = require('./../services/user-service');
const bookService = require('./../services/book-service');
const authorService = require('./../services/author-service');
const imageService = require('./../services/image-service');
const uploadImageService = require('./../services/upload-image');

var StatsD = require('node-statsd'),
client = new StatsD();

// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
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
    let startDate = new Date();
    logger.info('POST: new book',{label :"book-controller"})
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('book.post', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('user(book creater) not found',{label :"book-controller"})
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
                            logger.info('Authors for new book: '+ request.body.book.title+' saved',{label :"book-controller"})
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
                            if(request.body.book.imageData.length>0){
                                let saveImages = imageService.save(request.body,book.insertId)
                                saveImages.then((bookImgs)=>{
                                    logger.info('Metadata of images for new book: '+ request.body.book.title+' saved',{label :"book-controller"})
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
                                        logger.info('Images of new book: '+ request.body.book.title+' uploaded to S3',{label :"book-controller"})
                                    }
                                    logger.info('New book: '+ request.body.book.title+' created successfully',{label :"book-controller"})
                                    result(book);
                                })
                            }
                            else{
                                logger.info('New book: '+ request.body.book.title+' created successfully',{label :"book-controller"})
                                result(book)
                            }
                             
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
    let startDate = new Date();
    logger.info('GET: Books by logged in user:'+request.user.email,{label :"book-controller"})
    const promise =userService.findByUsername(request.user);
    
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('books.seller.get', seconds);
        response.status(200);
        response.json(user);
    };

    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found',{label :"book-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            else{
                const promiseBookBySeller = bookService.findBySellerId(val[0].id);
                promiseBookBySeller
                .then((books)=>{
                    let promiseBooks =[];
                    logger.info('Books from seller: '+request.user.email+' found',{label :"book-controller"})
                    for(let b in books){
                       let tempPromise = authorService.findByBookAndAddAuthors(books[b]);
                       promiseBooks.push(tempPromise);
                    }
                    Promise.all(promiseBooks)
                    .then((values) => {
                        logger.info('Successfully found Books and authors from seller: '+request.user.email,{label :"book-controller"})
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
    let startDate = new Date();
    logger.info('DELETE: book: '+request.params.bookid,{label :"book-controller"})
    const promise =userService.findByUsername(request.user);
    
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('books.seller.bookid.delete', seconds);
        response.status(200);
        response.json(user);
    };

    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found',{label :"book-controller"})
                return response.status(404).json({
                    message: "User not found"
                });
            }
            else{

                const getImagesOfBook =  imageService.findByBookId(request.params.bookid);
                getImagesOfBook
                .then((images)=>{
                    logger.info('Fetch metadata of images for book: '+ request.params.bookid +' for deletion',{label :"book-controller"})
                    let deleteImagesPromise = [];
                    for(let i in images){
                        deleteImagesPromise.push(uploadImageService.deleteImage(images[i].name))
                    }
                    Promise.all(deleteImagesPromise)
                    .then((deleteImage) => {
                        logger.info('Images deleted from s3 bucket for book: '+ request.params.bookid,{label :"book-controller"})   
                        const promiseDeleteBook = bookService.delete(request.params.bookid);
                        promiseDeleteBook
                        .then((books)=>{
                            logger.info('Book: '+ request.params.bookid + ' deleted successfully',{label :"book-controller"})
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
    let startDate = new Date();
    logger.info('PUT: update book: '+request.params.bookid,{label :"book-controller"})
    const promise =userService.findByUsername(request.user);
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('books.seller.bookid.put', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((val)=>{
        if(val.length < 1){
            logger.info('User not found',{label :"book-controller"})
            return response.status(404).json({
                message: "User not found"
            });
        }
        else{
            // console.log(request.body)
            let updateBookPromise = bookService.update(request.body,request.params.bookid);
            updateBookPromise
            .then((book)=>{
                logger.info('Book: '+request.params.bookid + ' details updated' ,{label :"book-controller"})
                let deleteAuthorPromise = authorService.deleteByBookId(request.params.bookid);
                deleteAuthorPromise
                .then((authors)=>{
                    let saveAuthorsPromise = authorService.save(request.body,request.params.bookid);
                    saveAuthorsPromise
                    .then((authors)=>{
                        // console.log(request.body)
                        logger.info('Book: '+request.params.bookid + ' authors updated' ,{label :"book-controller"})
                        let sellerId = request.body.book.sellerId;
                        let bookId = request.body.book.id;
                        for(let i in request.body.book.imageData){
                            request.body.book.imageData[i].metadata.newName
                                 = sellerId + "_" + bookId + "_" 
                                    + Date.now()
                                    + "_" + i
                                    + "_" + request.body.book.imageData[i].metadata.name;
                        }
                        if(request.body.book.imageData.length>0){

                            let saveImages = imageService.save(request.body,bookId)
                            saveImages.then((bookImgs)=>{
                                let images = [];
                                logger.info('Book: '+request.params.bookid + ' images metadata updated' ,{label :"book-controller"})
                                for (let i in request.body.book.imageData){
                                    uploadImageService.uploadFile(request.body.book.imageData[i].image
                                        ,request.body.book.imageData[i].metadata.newName
                                        ,request.body.book.imageData[i].metadata.type);
                                }
                                logger.info('Book: '+request.params.bookid + ' images uploaded to S3' ,{label :"book-controller"})
                                logger.info('Book: '+request.params.bookid + ' updated successfully' ,{label :"book-controller"})
                                result(book);
                            })
                        }
                        else{
                            logger.info('Book: '+request.params.bookid + ' updated successfully' ,{label :"book-controller"})
                            result(book);
                        }
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
    let startDate = new Date();
    const promise =userService.findByUsername(request.user);
    logger.info('GET: books from other sellers' ,{label :"book-controller"})
    // console.log("ok1")
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('books.others.get', seconds);
        response.status(200);
        response.json(user);
    };

    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('User not found' ,{label :"book-controller"})
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
                        logger.info('Successfully found books from other sellers' ,{label :"book-controller"})
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
    let startDate = new Date();
    client.increment('book.'+request.params.bookid+'.views');
    logger.info('GET: images of a book: '+request.params.bookid ,{label :"book-controller"})
    const promise =imageService.findByBookId(request.params.bookid);
    
    const result = (res) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('book.bookid.images.get', seconds);
        response.status(200);
        response.json(res);
        // res.writeHead(200, {'Content-Type': 'image/jpeg'});
        // res.write(data.Body, 'binary');
        // res.end(null, 'binary');
    };

    promise
    .then((val)=>{
            if(val.length < 1){
                logger.info('Book not found' ,{label :"book-controller"})
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
                    logger.info('Successfully found all images for book:'+request.params.bookid ,{label :"book-controller"})
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
        logger.error(error.message,{label :"book-controller"})
        if (error) {
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};