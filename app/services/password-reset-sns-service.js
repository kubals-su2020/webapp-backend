// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('/opt/config.properties');
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');


AWS.config.update({
    accessKeyId: 'AKIAJSG4FNJOH4KPOFGA',
    secretAccessKey: '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',
    region: 'us-east-1',
   });
 



// Set region
AWS.config.update({region: 'us-east-1'});
let ttl = 900;
// let arn = properties.get('target_arn');
let arn = 'arn:aws:sns:us-east-1:270462421134:password_reset'

exports.resetPassword = (user,token) => {
    // Create publish parameters
    var params = {
        Message: user.email+':' + token + ":" + ttl , /* required */
        TopicArn: arn
    };
    logger.info("Entered reset password sns service ",{label :"password-reset-sns-service"})
    // console.log(params)
    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    // Handle promise's fulfilled/rejected states
    return publishTextPromise;
}