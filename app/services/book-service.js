'use strict';
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
// const db = require("./../../models")
// var moment = require('moment');
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,result) => {
    let startDate = new Date();
  let queryString = "INSERT INTO book (isbn, title, quantity, price,publication_date,created_on,updated_on,seller_id) VALUES (?,?,?,?,?,?,?,?)";
  logger.info(queryString,{label :"book-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
          [bookDetails.book.isbn,
            bookDetails.book.title,
            bookDetails.book.quantity,
            bookDetails.book.price,
            bookDetails.book.published_date,
            new Date(),
            new Date(),
            bookDetails.book.seller.id],
           ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.book.insert', seconds);

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
    let startDate = new Date();
  let queryString = "SELECT * FROM book WHERE seller_id = '"+ sellerId +"'";
  logger.info(queryString,{label :"book-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {

        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('db.book.select.bysellerid', seconds);

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
    let startDate = new Date()
  let queryString = `DELETE FROM book WHERE id = `+ bookId;
  logger.info(queryString,{label :"book-service"})
  return new Promise( ( resolve, reject ) => {
    db.query( queryString, ( err, result ) => {

        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('db.book.delete', seconds);

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
    let startDate = new Date();
  let queryString = "UPDATE book SET isbn=?, title=?, quantity=?, price=?,publication_date=?,updated_on=? where id=?";
  logger.info(queryString,{label :"book-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
          [bookDetails.book.isbn,
            bookDetails.book.title,
            bookDetails.book.quantity,
            bookDetails.book.price,
            new Date(bookDetails.book.published_date),
            new Date(),
            bookId],
           ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.book.update', seconds);

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
    let startDate = new Date();
  let queryString = "SELECT * FROM book WHERE seller_id != '"+ sellerId +"'";
  logger.info(queryString,{label :"book-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {

        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('db.book.select.byothers', seconds);

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
    let startDate = new Date();
    let queryString = "SELECT * FROM book WHERE id = "+ cart.book_id;
    logger.info(queryString,{label :"book-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.book.select.bybookid', seconds);

            if ( err )
                return reject( err );
            // console.log(result)
            cart.book = result[0];
            resolve( cart );
        } );
    } );
  }


  /**
 * Find Books by book id.
 *
 * @param user
 */
exports.findByBookId = (cartEntry) => {
    // console.log(cartEntry)
    let startDate = new Date()
    let queryString = "SELECT * FROM book WHERE  id= '"+ cartEntry.book.id +"'";
    logger.info(queryString,{label :"book-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.book.select.bybookid', seconds);

            if ( err )
                return reject( err );
            cartEntry.bookWithSeller = result[0];
            resolve( cartEntry );
        } );
    } );
}

  /**
 * Update Books quantity 
 *
 * @param user
 */
exports.updateBookQuantity = (cartEntry) => {
    //  console.log("in update book quantity")
    //  console.log(cartEntry)
    let startDate = new Date();
    let newQuantity = cartEntry.bookWithSeller.quantity;
    newQuantity = newQuantity - cartEntry.quantity;
    let queryString = "UPDATE book SET quantity=? where id=?";
    logger.info(queryString,{label :"book-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString,
            [newQuantity,
              cartEntry.bookWithSeller.id],
             ( err, result ) => {

                let endDate = new Date();
                let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
                client.timing('db.book.update.quantity', seconds);

            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
}