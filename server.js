let express = require('express');
let app = express();
let bodyParser = require('body-parser');

var mysql = require('mysql');
let port = 3000;

var propertiesReader = require('properties-reader');
var properties = propertiesReader('/opt/config.properties');

//
// `logger` is the default container in winston, but you can also create your
// own containers.
//
const { format, loggers, transports } = require('winston')
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });
//
// The `add` method takes a string as a unique id we can later use to retrieve
// the logger we configured. As a second argument it takes an object to
// configure your logger the same way we do with the `createLogger` function.
//
loggers.add('my-logger', {
    format: combine(
        timestamp(),
        myFormat
      ),
  transports: [
    new transports.File({
        filename:'./logs/logger.log'
    })
  ]
})
// Get the logger we configured with the id from the container.
const logger = loggers.get('my-logger');
//Enabling CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods"," POST, PUT, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    next();
});
//Adding body parser for handling request and response objects.
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));
var db = mysql.createConnection({
    host: properties.get('db_hostname'),
    user: properties.get('db_username'),
    password: properties.get('db_password'),
    database: properties.get('db_database'),
    ssl: 'Amazon RDS'
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("CREATE DATABASE if not exists mydb", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database created");
    // });
    let sql= "show status like 'Ssl_version'";

    connection.query(sql, function (err, result) {
        if(err){
            logger.info("ssl error",{label :"server"})
            logger.info(err,{label :"server"})
        }
        else{
            logger.info("ssl success",{label :"server"})
            logger.info(result,{label :"server"})
        }
    })
    let createUserTbl = 'create table if not exists user(' +
        'id int not null primary key auto_increment unique,' +
        'first_name varchar(255)not null,' +
        'last_name varchar(255) not null,' +
        'hashed_password varchar(255) not null,' +
        'email varchar(255) not null unique)';

    let createBookTbl = 'create table if not exists book(' +
        'id int not null primary key auto_increment unique,' +
        'isbn varchar(255)not null,' +
        'title varchar(255) not null,' +
        'quantity int not null check(quantity >= 0 and quantity <= 999),' +
        'price double not null check(price >= 0.01 and price <= 9999.99),'+
        'publication_date datetime NOT NULL,'+
        'created_on datetime NOT NULL,'+
        'updated_on datetime NOT NULL,'+
        'seller_id int,'+
        'FOREIGN KEY (seller_id)'+
        'REFERENCES user (id))';

    let createAuthorTbl = 'create table if not exists author(' +
        'id int not null primary key auto_increment unique,' +
        'author_name varchar(255)not null,' +
        'book_id int,' +
        'FOREIGN KEY (book_id)'+
        'REFERENCES book (id)'+
        'ON UPDATE CASCADE ON DELETE CASCADE)';
    
    let createCartTbl = 'create table if not exists cart(' +
        'id int not null primary key auto_increment unique,' +
        'buyer_id int,' +
        'FOREIGN KEY (buyer_id)'+
        'REFERENCES user (id)'+
        'ON UPDATE CASCADE ON DELETE CASCADE)';
    let createCartEntriesTbl = 'create table if not exists cart_entry(' +
        'quantity int not null ,' +
        'cart_id int,' +
        'book_id int,' +
        'PRIMARY KEY (cart_id, book_id),'+
        'FOREIGN KEY (cart_id)'+
        'REFERENCES cart (id)'+
        'ON UPDATE CASCADE ON DELETE CASCADE, '+
        'FOREIGN KEY (book_id)'+
        'REFERENCES book (id)'+
        'ON UPDATE CASCADE ON DELETE CASCADE)';
    
    let createBookImgMap = 'create table if not exists book_image_map(' +
        'image_id int not null primary key auto_increment unique,' +
        'book_id int,' +
        'upload_date datetime NOT NULL,'+
        'type varchar(255)not null,'+
        'name varchar(255)not null,'+
        'size double NOT NULL,'+
        'FOREIGN KEY (book_id)'+
        'REFERENCES book (id)'+
        'ON UPDATE CASCADE ON DELETE CASCADE)';
        // let createEmailTokenMap = 'create table if not exists email_token_map(' +
        // 'id int not null primary key auto_increment unique,' +
        // 'user_id int not null unique,' +
        // 'token varchar(255) not null,'+
        // 'FOREIGN KEY (user_id)'+
        // 'REFERENCES user (id)'+
        // 'ON UPDATE CASCADE ON DELETE CASCADE)';
    let createEmailTokenMap = 'create table if not exists email_token_map(' +
        'user_id int not null primary key unique,' +
        'token varchar(255) not null,'+
        'FOREIGN KEY (user_id)'+
        'REFERENCES user (id)'+
        'ON UPDATE CASCADE ON DELETE CASCADE)';

    db.query(createUserTbl, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("User table created!")
        }
    });

    db.query(createBookTbl, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Book table created!")
        }
    });
    db.query(createAuthorTbl, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Author table created!")
        }
    });
    db.query(createCartTbl, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Cart table created!")
        }
    });
    db.query(createCartEntriesTbl, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Cart Entries table created!")
        }
    });
    db.query(createBookImgMap, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Book image Entries table created!")
        }
    });
    db.query(createEmailTokenMap, function(err, results, fields) {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Email token map table created!")
        }
    });
});
global.db = db;

app.use(bodyParser.json({limit: '10mb', extended: true}));

const initApp = require('./app/app');
initApp(app);

module.exports = app;
// HOST="localhost"
// app.listen(port, HOST, function(err) {
//     if (err) return logger.error(err);
//     logger.info('Server started on: ' + port,{label :"server"})
//     console.log("Listening at http://%s:%s", HOST, port);
//   });
app.listen(port);

logger.info('Server started on: ' + port,{label :"server"})
// console.log('Server started on: ' + port);