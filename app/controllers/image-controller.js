'use strict';

const uploadImageService = require('./../services/upload-image');
const imageService = require('./../services/image-service');
/**
 * Delete book sets the response.
 *
 * @param request
 * @param response
 */
//creates a new book
exports.deleteImage = (request, response) => {
    // console.log(request.params.imagename)
    var promise = uploadImageService.deleteImage(request.params.imagename)
    const result = (user) => {
        response.status(200);
        response.json(user);
    };
    promise
    .then((deleteImage)=>{
        var promiseDeleteImageMetadata = imageService.deleteByImageName(request.params.imagename);
        promiseDeleteImageMetadata
        .then((deleteMetatadata)=>{
            result();
        })
        
    })
    .catch(renderErrorResponse(response)) 
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
