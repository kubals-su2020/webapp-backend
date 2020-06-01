'use strict';
// const db = require("./../../models")
/**
 * Saves the new user object.
 *
 * @param user
 */

exports.save = (user) => {
    let queryString = "INSERT INTO cart (buyer_id)  VALUES (?)";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,user.insertId, ( err, rows ) => {
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
    // console.log(user)
    let queryString = "SELECT * FROM cart WHERE buyer_id = '"+ user.id +"'";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
};