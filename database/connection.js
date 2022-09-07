const mysql = require('mysql')

const connection = mysql.createConnection({
    host: process.env.HOST_DATABASE,
    user: process.env.USER_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE_DATABASE,
});

function connectionToDatabase(){
    connection.connect((err) => {
        if(err) throw err;
        console.log("Connected to database");
    });
}

module.exports = { connection, connectionToDatabase };