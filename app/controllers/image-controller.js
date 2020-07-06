'use strict';

const uploadImageService = require('./../services/upload-image');
const imageService = require('./../services/image-service');
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
/**
 * Delete book sets the response.
 *
 * @param request
 * @param response
 */
//creates a new book
exports.deleteImage = (request, response) => {
    // console.log(request.params.imagename)
    let startDate = new Date();
    var promise = uploadImageService.deleteImage(request.params.imagename)
    const result = (user) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('image.imagename.delete', seconds);
        response.status(200);
        response.json(user);
    };
    promise
    .then((deleteImage)=>{
        var promiseDeleteImageMetadata = imageService.deleteByImageName(request.params.imagename);
        promiseDeleteImageMetadata
        .then((deleteMetatadata)=>{
            logger.info('Image: '+ request.params.imagename + ' deleted successfully',{label :"cart-entry-controller"})
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
        logger.error(error.message,{label :"image-controller"})
        if (error) {
            response.status(500);
            response.json({
                message: error.message
            });
        }
    };
    return errorCallback;
};
