'use strict';
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
// const db = require("./../../models")
/**
 * Saves the new user object.
 *
 * @param user
 */

exports.save = (user) => {
    let startDate = new Date();
    let queryString = "INSERT INTO cart (buyer_id)  VALUES (?)";
    logger.info(queryString,{label :"cart-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,user.insertId, ( err, rows ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.cart.insert', seconds);

            if ( err )
                return reject( err );
            resolve( rows );
        } );
    } );

};

/**
 * Find cart id using user id.
 *
 * @param user
 */

exports.getCartByUserId = (user) => {
    //  console.log(user)
    let startDate = new Date();
    let queryString = "SELECT * FROM cart WHERE buyer_id = '"+ user.id +"'";
    logger.info(queryString,{label :"cart-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.cart.select.bybuyerid', seconds);

            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};