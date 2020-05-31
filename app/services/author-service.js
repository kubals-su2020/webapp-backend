'use strict';
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,bookId) => {
  let records =[];
  for(let a in bookDetails.book.authors){
    let record = [];
    record.push(bookDetails.book.authors[a].author_name,bookId.insertId);
  } 
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
};