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

exports.save = (cartEntry,cartId) => {
    // console.log(cartEntry)
    let startDate = new Date();
    // console.log("in service")
    // console.log(cartEntry)
    if(cartEntry.quantity>0){
        let queryString = "INSERT INTO cart_entry (quantity,book_id,cart_id)  VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=VALUES(quantity)";
        logger.info(queryString,{label :"cart-entry-service"})
        return new Promise( ( resolve, reject ) => {
            logger.info("quantity:"+cartEntry.quantity+",bookid:"+cartEntry.book.id+",buyerid/cartid:"+cartId,{label :"cart-entry-service"})
            db.query( queryString,[cartEntry.quantity,cartEntry.book.id,cartId], ( err, rows ) => {
                // console.log("done")
                let endDate = new Date();
                let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                client.timing('db.cartentry.insert', seconds);

                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    else{
        let queryString = 'DELETE FROM cart_entry WHERE book_id = '+ cartEntry.book.id +' AND cart_id ='+cartId ;
        logger.info(queryString,{label :"cart-entry-service"})
        return new Promise( ( resolve, reject ) => {
          db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.cartentry.delete.bybookid', seconds);

              if ( err )
                  return reject( err );
              resolve( result );
          } );
      } );
    }


};

/**
 * Find cart  using user id.
 *
 * @param user
 */

exports.deleteEntryFromCart = (cartEntry) => {
    // console.log(cartEntry)
    let startDate = new Date();
    let queryString = 'DELETE FROM cart_entry WHERE book_id = '+ cartEntry.bookWithSeller.id +' AND cart_id ='+cartEntry.cart_id ;
    logger.info(queryString,{label :"cart-entry-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.cartentry.delete.bybookid', seconds);

            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};

/**
 * Delete entry from cart.
 *
 * @param user
 */

exports.getCartByCartId = (cart) => {
    let startDate = new Date();
    let queryString = "SELECT * FROM cart_entry WHERE cart_id = '"+ cart[0].id +"'";
    logger.info(queryString,{label :"cart-entry-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.cartentry.select.bycartid', seconds);

            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};
