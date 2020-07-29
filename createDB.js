const mysql = require('mysql');
var propertiesReader = require('properties-reader');
var properties = propertiesReader('/opt/config.properties');
const con;
// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
if(process.env.ENVIRONMENT == 'test'){
     con = mysql.createConnection({
        host: properties.get('db_hostname'),
        user: properties.get('db_username'),
        password: properties.get('db_password'),
        port: 3306
    });
}
else{
     con = mysql.createConnection({
        host: properties.get('db_hostname'),
        user: properties.get('db_username'),
        password: properties.get('db_password'),
        port: 3306,
        ssl: 'Amazon RDS'
    });
}



con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE if not exists csye6225", function (err, result) {
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