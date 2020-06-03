let express = require('express');
let app = express();
let bodyParser = require('body-parser');

var mysql = require('mysql');
let port = 3000;
//Enabling CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods"," POST, PUT, GET, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    next();
});
//Adding body parser for handling request and response objects.
app.use(bodyParser.urlencoded({
    extended: true
}));
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test@123",
    database: "tdb_dev"
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("CREATE DATABASE if not exists mydb", function (err, result) {
    //     if (err) throw err;
    //     console.log("Database created");
    // });
    
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
});
global.db = db;
app.use(bodyParser.json());

const initApp = require('./app/app');
initApp(app);

module.exports = app;
app.listen(port);
console.log('Server started on: ' + port);