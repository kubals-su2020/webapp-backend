let express = require('express');
let app = express();
let bodyParser = require('body-parser');

var mysql = require('mysql');
const PORT = process.env.PORT || 3000;

const db = require('./models');
//Enabling CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods"," POST, PUT, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
    next();
});
//Adding body parser for handling request and response objects.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
// var db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "test@123",
//     database: "mydb"
// });
// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     // con.query("CREATE DATABASE if not exists mydb", function (err, result) {
//     //     if (err) throw err;
//     //     console.log("Database created");
//     // });
    
//     let createUserTbl = 'create table if not exists user(' +
//         'id int not null primary key auto_increment unique,' +
//         'first_name varchar(255)not null,' +
//         'last_name varchar(255) not null,' +
//         'password varchar(255) not null,' +
//         'email varchar(255) not null unique)';
//     db.query(createUserTbl, function(err, results, fields) {
//         if (err) {
//             console.log(err.message);
//         }
//         else {
//             console.log("User table created!")
//         }
//     });

// });
// global.db = db;
 app.use(bodyParser.json());

const initApp = require('./app/app');
initApp(app);

// module.exports = app;
// app.listen(port);
// console.log('Server started on: ' + port);

db.sequelize.sync().then(()=>{
    app.listen(PORT,()=>{
         console.log('listening on http://localhost:'+PORT);
    })
})

module.exports = app;