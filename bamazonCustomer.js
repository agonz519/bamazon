require('dotenv').config();
const mysql = require('mysql');
const cTable = require('console.table');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE
});

connection.connect(function(error) {
  if (error) throw 'An error has occurred while connecting - ' + error;
  console.log('connected as id ' + connection.threadId);
  greetCustomer();
  connection.end();
});

let queryItemsForSale = new Promise((resolve, reject) => {
  connection.query('SELECT * FROM bamazon.products', function (error, response) {
    if (error) throw 'An error has occurred with selecting data - ' + error;
    let productArray = [],
      arrayItem = '';
    response.forEach((item) => {
      arrayItem = item.item_id + ': ' + item.product_name + ' ----- $' + item.price;
      productArray.push(arrayItem);
    });
    resolve(productArray);
  });
});

let greetCustomer = () => {
  queryItemsForSale.then((productArray) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'product',
        message: 'Shopkeeper: Hello adventurer! What item would you like to purchase to help you on your journey?',
        choices: productArray
      }
    ]).then((answer) => {
      console.log('You chose ' + answer.product);
      let tempArray = answer.product.split(':');
      let id = tempArray[0];
      console.log('The ID for this item is ' + id);
    })
  });
};


//
// function queryItemsForSale(callback) {
//   connection.query('SELECT * FROM bamazon.products', function(error, response) {
//     if (error) throw 'An error has occurred with selecting data - ' + error;
//     // console.log(response);
//     let productArray = [];
//     let arrayItem = '';
//     response.forEach((item) => {
//       arrayItem = item.item_id + ': ' + item.product_name + ' ----- $' + item.price;
//       productArray.push(arrayItem);
//     });
//     return productArray;
//   });
//   callback();
// }
//
// let greetCustomer = () => {
//   queryItemsForSale(
//     inquirer.prompt([
//       {
//         type: 'list',
//         name: 'product',
//         message: 'Shopkeeper: Hello adventurer! What item would you like to purchase to help you on your journey?',
//         choices: productArray
//       }
//     ]).then((answer) => {
//       console.log('please work' + answer.product);
//     })
//   );
//
// };
//
//
// //
// // let greetCustomer () => {
//
// // }
