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

exports.save = (user,result) => {
    let startDate = new Date();
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
    logger.info(queryString,{label :"user-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, rows ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.user.insert', seconds);

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
    let startDate = new Date();
    var email = user.email;
//     console.log(email)
//    return  db.User_tbl.findAll({
//         where:{
//             email:user.email
//         }
//     })
    //  console.log(email)
    let queryString = "SELECT * FROM user WHERE email = '"+ email +"'";
    logger.info(queryString,{label :"user-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.user.select.byusername', seconds);

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
    let startDate =  new Date();
    let queryString = "SELECT * FROM user WHERE id = '"+ id +"'";
    logger.info(queryString,{label :"user-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.user.select.byid', seconds);

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
    let startDate = new Date();
    let queryString = "UPDATE user SET first_name = ?, last_name =?, hashed_password =? WHERE id=?";
    logger.info(queryString,{label :"user-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,
            [user.first_name,user.last_name,user.hashed_password,user.id],
             ( err, result ) => {
                let endDate = new Date();
                let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                client.timing('db.user.update', seconds);
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
    let startDate = new Date()
    let queryString = "UPDATE user SET first_name = ?, last_name =? WHERE id=?";
    logger.info(queryString,{label :"user-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,
            [user.first_name,user.last_name,user.id],
             ( err, result ) => {
                let endDate = new Date();
                let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                client.timing('db.user.update.few', seconds);
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
}