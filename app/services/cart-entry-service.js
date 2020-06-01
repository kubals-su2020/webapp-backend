'use strict';
// const db = require("./../../models")
/**
 * Saves the new user object.
 *
 * @param user
 */

exports.save = (cartEntry) => {
    // console.log("in service")
    // console.log(cartEntry)
    if(cartEntry.quantity>0){
        let queryString = "INSERT INTO cart_entry (quantity,book_id,cart_id)  VALUES (?,?,?) ON DUPLICATE KEY UPDATE quantity=VALUES(quantity)";
        return new Promise( ( resolve, reject ) => {
            db.query( queryString,[cartEntry.quantity,cartEntry.book.id,cartEntry.buyer.id], ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    else{
        let queryString = 'DELETE FROM cart_entry WHERE book_id = '+ cartEntry.book.id +' AND cart_id ='+cartEntry.buyer.id ;
        return new Promise( ( resolve, reject ) => {
          db.query( queryString, ( err, result ) => {
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

exports.getCartByCartId = (cart) => {
    let queryString = "SELECT * FROM cart_entry WHERE cart_id = '"+ cart[0].id +"'";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};