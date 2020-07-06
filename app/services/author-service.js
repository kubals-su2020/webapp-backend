'use strict';
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,bookId) => {
    let startDate = new Date();
  let records =[];
//   console.log(bookDetails)
  for(let a in bookDetails.book.authors){
    let record = [];
    record.push(bookDetails.book.authors[a].author_name,bookId);
    records.push(record)
  } 
  let queryString = "INSERT INTO author (author_name,book_id) VALUES ?";
  logger.info(queryString,{label :"author-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
         [records] ,
           ( err, result ) => {
            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.author.insert', seconds);
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );
};

/**
 * Delete Author belonging to book using book id.
 *
 * @param user
 */
exports.deleteByBookId = (bookId) => {
    let startDate = new Date();
    console.log(bookId)
    let queryString = 'DELETE FROM author WHERE book_id = '+ bookId;
    logger.info(queryString,{label :"author-service"})
    return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {
        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('db.author.delete', seconds);
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );
}
/**
 * Find Books belonging to seller using seller id.
 *
 * @param user
 */
exports.findByBookAndAddAuthors = (book) => {
    // console.log(book)
    let startDate = new Date();
    let queryString = "SELECT * FROM author WHERE book_id = "+ book.id;
    logger.info(queryString,{label :"author-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            
            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.author.select.bybookid', seconds);

            if ( err )
                return reject( err );
            // console.log(result)
            book.authors = result;
            resolve( book );
        } );
    } );
}
/**
 * Find Books belonging to seller using seller id.
 *
 * @param user
 */
exports.findByBookAndAddAuthorsV2 = (bookDetails) => {
    // console.log(book)
    let startDate = new Date();
    let queryString = "SELECT * FROM author WHERE book_id = "+ bookDetails.book.id;
    logger.info(queryString,{label :"author-service"})
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.author.select.bybookid', seconds);

            if ( err )
                return reject( err );
            // console.log(result)
            bookDetails.book.authors = result;
            resolve( bookDetails );
        } );
    } );
}


// /**
//  * Find Books belonging to seller using seller id.
//  *
//  * @param user
//  */
// exports.findAuthorsByBookId = (book) => {
//     // console.log(book)
//     let queryString = "SELECT * FROM author WHERE book_id = "+ book.id;
//     return new Promise( ( resolve, reject ) => {
//         db.query( queryString, ( err, result ) => {
//             if ( err )
//                 return reject( err );
//             resolve( result );
//         } );
//     } );
// }