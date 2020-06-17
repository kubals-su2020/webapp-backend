'use strict';
/**
 * Saves the new image object.
 *
 * @param user
 */

exports.save = (bookDetails,bookId) => {
    // console.log(bookDetails);
    //  console.log(bookDetails.book.imageData)
   let records =[];
// //   console.log(bookDetails)
  for(let a in bookDetails.book.imageData){
    let record = [];
    // console.log(bookDetails.book.imageData[a])
    record.push(bookDetails.book.imageData[a].metadata.newName,
        bookDetails.book.imageData[a].metadata.type,
        bookDetails.book.imageData[a].metadata.size,
        new Date(),
        bookId);
    records.push(record)
  } 

  let queryString = "INSERT INTO book_image_map (name,type,size,upload_date,book_id) VALUES ?";
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
 * Find image object using book id.
 *
 * @param user
 */

exports.findByBookId = (BookId) => {
  let queryString = "SELECT * FROM book_image_map WHERE book_id = '"+ BookId +"'";
  return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {
          if ( err )
              return reject( err );
          resolve( result );
      } );
  } );
};

/**
 * Delete Image belonging to book using image name.
 *
 * @param user
 */
exports.deleteByImageName = (imageName) => {
//   console.log(imageName)
  let queryString = "DELETE FROM book_image_map WHERE name = '"+ imageName +"'";
  return new Promise( ( resolve, reject ) => {
    db.query( queryString, ( err, result ) => {
        if ( err )
            return reject( err );
        resolve( result );
    } );
} );
}