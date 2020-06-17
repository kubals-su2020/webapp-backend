const mysql = require('mysql');

// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "test@123"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE if not exists tdb_dev", function (err, result) {
        if (err) throw err;
        console.log("Database created");
        process.exit();
    });
});


// con.end((err) => {
//   // The connection is terminated gracefully
//   // Ensures all remaining queries are executed
//   // Then sends a quit packet to the MySQL server.
// });