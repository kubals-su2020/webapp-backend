'use strict';
// const db = require("./../../models")
// var moment = require('moment');
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,result) => {
  let queryString = "INSERT INTO book (isbn, title, quantity, price,publication_date,seller_id) VALUES (?,?,?,?,?,?)";
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
          [bookDetails.book.isbn,
            bookDetails.book.title,
            bookDetails.book.quantity,
            bookDetails.book.price,
            bookDetails.book.published_date,
            bookDetails.book.seller.id],
           ( err, result ) => {
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );

  //  return db.Book.create({
  //       isbn: bookDetails.book.isbn,
  //       title: bookDetails.book.title,
  //       quantity:bookDetails.book.quantity,
  //       price:bookDetails.book.price,
  //       publication_date:bookDetails.book.published_date,
        
  //       // bookDetails.book.publication_date,
  //       sellerId:bookDetails.book.seller.id,
  //       // User_tbl:bookDetails.book.seller,
  //       Authors :bookDetails.book.authors,
  //     },
  //     {
  //       // association: [db.User_tbl],
  //       include: [ db.Author ]
  //     });

};
/**
 * Find Books belonging to seller using seller id.
 *
 * @param user
 */
exports.findBySellerId = (sellerId) => {
  let queryString = "SELECT * FROM book WHERE seller_id = '"+ sellerId +"'";
  return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );
  // return  db.Book.findAll({
  //     where:{
  //         sellerId:sellerId
  //     },
  //     include: [ db.User_tbl, db.Author ]
      
  // })
};
/**
 * Delete Book belonging to seller using book id.
 *
 * @param user
 */
exports.delete = (bookid) => {
  let queryString = `DELETE FROM book WHERE id = `+ bookid;
  return new Promise( ( resolve, reject ) => {
    db.query( queryString, ( err, result ) => {
        if ( err )
            return reject( err );
        resolve( result );
    } );
} );
  // return  db.Book.destroy({
  //     where:{
  //         id:bookid
  //     }
      
  // })
};
// /**
//  * Find user object using email.
//  *
//  * @param user
//  */

// exports.findByUsername = (user,result) => {
//     var email = user.email;
//     console.log(email)
//    return  db.User_tbl.findAll({
//         where:{
//             email:user.email
//         }
//     })
// };
// /**
//  * Find user object using id.
//  *
//  * @param user
//  */


// /**
//  * Update user object.
//  *
//  * @param user
//  */

// exports.update = (user,result) => {
//     return db.User_tbl.update({
//         first_name : user.first_name,
//         last_name: user.last_name,
//         hashed_password:user.hashed_password
//     },{
//         where:{
//             id:user.id
//         }
//     })
// };