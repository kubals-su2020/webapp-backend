'use strict';
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
// const db = require("./../../models")
/**
 * Saves the new id/token object.
 *
 * @param user
 */

exports.save = (jwtToken,userId) => {
    let startDate = new Date();
    // console.log(jwtToken)
    let queryString = "INSERT INTO email_token_map (token,user_id)  VALUES (?,?) ON DUPLICATE KEY UPDATE token=VALUES(token)";
    logger.info(queryString,{label :"token-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,[jwtToken,userId], ( err, rows ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.emailtokenmap.insert', seconds);

            if ( err )
                return reject( err );
            // console.log(rows)
            resolve( rows );
        } );
    } );

};

/**
 * Find token using user id.
 *
 * @param user
 */

exports.getTokenUserId = (userId) => {
    //  console.log(user)
    let startDate = new Date();
    let queryString = "SELECT * FROM email_token_map WHERE user_id = '"+ userId +"'";
    logger.info(queryString,{label :"token-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.emailtokenmap.select', seconds);

            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};

/**
 * delete token using user id.
 *
 * @param user
 */

exports.deleteTokenUserId = (userId) => {
    //  console.log(user)
    let startDate = new Date();
    let queryString = `DELETE FROM email_token_map WHERE user_id = `+ userId;
    logger.info(queryString,{label :"token-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.emailtokenmap.delete', seconds);

            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};