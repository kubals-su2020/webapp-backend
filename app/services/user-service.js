'use strict';
// const db = require("./../../models")
/**
 * Saves the new user object.
 *
 * @param user
 */

exports.save = (user,result) => {
    // console.log("here")
    var first_name = user.first_name;
    var last_name = user.last_name;
    var email = user.email;
    var hashed_password = user.hashed_password;

//    return db.User_tbl.create({
//         first_name: user.first_name,
//         last_name:user.last_name,
//         email:user.email,
//         hashed_password:user.hashed_password
//       })
    let queryString = "INSERT INTO `user` (first_name, last_name, email, hashed_password) VALUES ('" +
            first_name + "', '" + last_name + "', '" + email + "', '" + hashed_password + "')";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, rows ) => {
            if ( err )
                return reject( err );
            resolve( rows );
        } );
    } );

};
/**
 * Find user object using email.
 *
 * @param user
 */

exports.findByUsername = (user,result) => {
    var email = user.email;
//     console.log(email)
//    return  db.User_tbl.findAll({
//         where:{
//             email:user.email
//         }
//     })
    //  console.log(email)
    let queryString = "SELECT * FROM user WHERE email = '"+ email +"'";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );

};
/**
 * Find user object using id.
 *
 * @param user
 */

exports.findById = (id,result) => {
    let queryString = "SELECT * FROM user WHERE id = '"+ id +"'";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
    // return  db.User_tbl.findAll({
    //     where:{
    //         id:user.id
    //     }
    // })
};
/**
 * Update user object.
 *
 * @param user
 */

exports.update = (user,result) => {
    let queryString = "UPDATE user SET first_name = ?, last_name =?, hashed_password =? WHERE id=?";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,
            [user.first_name,user.last_name,user.hashed_password,user.id],
             ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
    // return db.User_tbl.update({
    //     first_name : user.first_name,
    //     last_name: user.last_name,
    //     hashed_password:user.hashed_password
    // },{
    //     where:{
    //         id:user.id
    //     }
    // })
};

/**
 * Update user object.
 *
 * @param user
 */

exports.updateFew = (user,result) => {
    let queryString = "UPDATE user SET first_name = ?, last_name =? WHERE id=?";
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,
            [user.first_name,user.last_name,user.id],
             ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
}