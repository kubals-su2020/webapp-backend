'use strict';
const db = require("./../../models")
var moment = require('moment');
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,result) => {
   return db.Book.create({
        isbn: bookDetails.book.isbn,
        title: bookDetails.book.title,
        quantity:bookDetails.book.quantity,
        price:bookDetails.book.price,
        publication_date:bookDetails.book.published_date,
        
        // bookDetails.book.publication_date,
        sellerId:bookDetails.book.seller.id,
        // User_tbl:bookDetails.book.seller,
        Authors :bookDetails.book.authors,
      },
      {
        // association: [db.User_tbl],
        include: [ db.Author ]
      });

};

/**
 * Adds Authors To Project object.
 *
 * @param user
 */

// exports.addAuthorToProjects = (book,authors) => {
//   // let authorsList = authors.split(",");
//   // console.log(authorsList);
//   return book.addAuthors(authorsList);
//   //  return db.Book.create({
//   //       isbn: bookDetails.book.isbn,
//   //       title: bookDetails.book.title,
//   //       quantity:bookDetails.book.quantity,
//   //       price:bookDetails.book.price,
//   //       publication_date:bookDetails.book.publication_date,
//   //       sellerId:bookDetails.sellerId
//   //     });

// };
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

exports.findBySellerId = (sellerId) => {
    return  db.Book.findAll({
        where:{
            sellerId:sellerId
        },
        include: [ db.User_tbl, db.Author ]
        
    })
};
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