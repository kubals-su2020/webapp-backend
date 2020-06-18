var q = require('q');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('/tmp/config.properties');
const ID = properties.get('aws_access_key');
const SECRET = properties.get('aws_secret_key');

// The name of the bucket that you have created
const BUCKET_NAME = 'webapp.akhil.rane';

const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});


exports.uploadFile = (fileContent,name,type) => {
    // Setting up S3 upload parameters
    buf = Buffer.from(fileContent.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const params = {
        Bucket: BUCKET_NAME,
        Key: name, // File name you want to save as in S3
        // Body: fileContent
        Body:buf,
        ContentEncoding: 'base64',
        ContentType: type
    };


    s3.putObject(params, function(err, data){
        if (err) { 
          console.log(err);
          console.log('Error uploading data: ', data); 
        } else {
          console.log('succesfully uploaded the image!');
        }
    });
    // Uploading files to the bucket
    // s3.upload(params, function(err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     console.log(`File uploaded successfully. ${data.Location}`);
    // });
};

exports.getImage = (name)=>{
    console.log("getimage")
        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: name, // File name you want to get from S3
        };
        return new Promise( ( resolve, reject ) => {
            s3.getObject( params, ( err, result ) => {
                if ( err )
                    return reject( err );
                    // result.Body = result.Body.toString('base64')
                    // console.log(result)
                    result.name = name;
                resolve( result );
            } );
        } );
    //  return s3.getObject(params);

    // s3.getObject(params, function(err, data) {
        
    //     console.log(data.Body)
    //    return (data.Body);
    //     // res.writeHead(200, {'Content-Type': 'image/jpeg'});
    //     // res.write(data.Body, 'binary');
    //     // res.end(null, 'binary');
    // });
}

exports.deleteImage = (name)=>{
    console.log("deleteimage")
    const params = {
        Bucket: BUCKET_NAME,
        Key: name, // File name you want to delete from S3
    };
    return new Promise( ( resolve, reject ) => {
        s3.deleteObject( params, ( err, result ) => {
            if ( err )
                return reject( err );
            resolve( result );
        } );
    } );
}
// module.exports = getImage;
// module.exports = uploadFile;

