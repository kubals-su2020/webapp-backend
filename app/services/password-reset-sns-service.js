// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('/opt/config.properties');
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');
let region = properties.get('region');

const { v4: uuidv4 } = require('uuid');

// Set region
AWS.config.update({region: region});
let ttl = 900;
let arn = properties.get('target_arn');


exports.resetPassword = (user,token) => {
    // Create publish parameters
    var params = {
        Message: user.email+':' + token + ":" + ttl + ":" + uuidv4(), /* required */
        TopicArn: arn
    };
    logger.info("Entered reset password sns service ",{label :"password-reset-sns-service"})
    // console.log(params)
    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    // Handle promise's fulfilled/rejected states
    return publishTextPromise;
}