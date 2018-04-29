require('dotenv').config();
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE
});

connection.connect(function(error) {
  if (error) throw 'An error has occurred while connecting - ' + error;
  console.log("connected as id " + connection.threadId);
  selectAll();
  connection.end();
});

function selectAll() {
  connection.query('SELECT * FROM bamazon.products', function(error, response) {
    if (error) throw 'An error has occurred with selecting data - ' + error;
    console.table(response);
  });
}