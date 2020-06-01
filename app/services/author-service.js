'use strict';
/**
 * Saves the new book object.
 *
 * @param user
 */

exports.save = (bookDetails,bookId) => {
  let records =[];
//   console.log(bookDetails)
  for(let a in bookDetails.book.authors){
    let record = [];
    record.push(bookDetails.book.authors[a].author_name,bookId);
    records.push(record)
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

/**
 * Delete Author belonging to book using book id.
 *
 * @param user
 */
exports.deleteByBookId = (bookId) => {
    console.log(bookId)
    let queryString = 'DELETE FROM author WHERE book_id = '+ bookId;
    return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {
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
    let queryString = "SELECT * FROM author WHERE book_id = "+ book.id;
    return new Promise( ( resolve, reject ) => {
        db.query( queryString, ( err, result ) => {
            if ( err )
                return reject( err );
            // console.log(result)
            book.authors = result;
            resolve( book );
        } );
    } );
}