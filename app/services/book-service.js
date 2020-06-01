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
exports.delete = (bookId) => {
  let queryString = `DELETE FROM book WHERE id = `+ bookId;
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
/**
 * Updated a book object.
 *
 * @param user
 */

exports.update = (bookDetails,bookId) => {
  let queryString = "UPDATE book SET isbn=?, title=?, quantity=?, price=?,publication_date=? where id=?";
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
          [bookDetails.book.isbn,
            bookDetails.book.title,
            bookDetails.book.quantity,
            bookDetails.book.price,
            new Date(bookDetails.book.published_date),
            bookId],
           ( err, result ) => {
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );

};




/**
 * Find Books belonging to other sellers.
 *
 * @param user
 */
exports.findByOtherSellers = (sellerId) => {
  let queryString = "SELECT * FROM book WHERE seller_id != '"+ sellerId +"'";
  return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );
}




/**
 * Find Books belonging to other sellers.
 *
 * @param user
 */
exports.findByBookInCartAndAdd = (cart) => {
    // console.log(cart);
    // console.log("new serv")
    let queryString = "SELECT * FROM book WHERE id = "+ cart.book_id;
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            if ( err )
                return reject( err );
            // console.log(result)
            cart.book = result;
            resolve( cart );
        } );
    } );
  }