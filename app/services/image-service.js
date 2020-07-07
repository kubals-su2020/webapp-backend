'use strict';
// Get the default container from winston.
const { loggers } = require('winston')

// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');

var StatsD = require('node-statsd'),
client = new StatsD();
/**
 * Saves the new image object.
 *
 * @param user
 */

exports.save = (bookDetails,bookId) => {
    let startDate = new Date()
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
  logger.info(queryString,{label :"image-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString,
         [records] ,
           ( err, result ) => {

            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            client.timing('db.book_image_map.insert', seconds);

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
    let startDate = new Date();
  let queryString = "SELECT * FROM book_image_map WHERE book_id = '"+ BookId +"'";
  logger.info(queryString,{label :"image-service"})
  return new Promise( ( resolve, reject ) => {
      db.query( queryString, ( err, result ) => {

        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('db.book_image_map.select.bybookid', seconds);
        
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
    let startDate = new Date();
  let queryString = "DELETE FROM book_image_map WHERE name = '"+ imageName +"'";
  logger.info(queryString,{label :"image-service"})
  return new Promise( ( resolve, reject ) => {
    db.query( queryString, ( err, result ) => {

        let endDate = new Date();
        let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        client.timing('db.book_image_map.delete', seconds);

        if ( err )
            return reject( err );
        resolve( result );
    } );
} );
}