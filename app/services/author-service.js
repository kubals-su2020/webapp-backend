'use strict';
// const db = require("./../../models")
// var moment = require('moment');
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,bookId) => {
  let records =[];
//   console.log(bookId)
  for(let a in bookDetails.book.authors){
    let record = [];
    record.push(bookDetails.book.authors[a].author_name,bookId.insertId);
    // console.log
    records.push(record)
  }  
  console.log(records)
  let queryString = "INSERT INTO author (author_name,book_id) VALUES ?";
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
         [records] ,
           ( err, result ) => {
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );

  
  // let queryString = "INSERT INTO `book` (isbn, title, quantity, price,publication_date,seller_id) VALUES ('" +
  //   bookDetails.book.isbn + "', '" +
  //   bookDetails.book.title + "', '" + 
  //   bookDetails.book.quantity + "', '" +
  //   bookDetails.book.price + "', '" + 
  //   bookDetails.book.published_date + "', '" + 
  //   bookDetails.book.seller.id +"')";
  //   return new Promise( ( resolve, reject ) => {
  //       db.query( queryString, ( err, rows ) => {
  //         if ( err )
  //             return reject( err );
  //         resolve( rows );
  //       } );
  //   } );


    
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