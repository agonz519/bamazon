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
      },
      {
        type: 'input',
        name: 'units',
        message: 'How many units would you like to purchase?'
      }
    ]).then((answer) => {
      let tempArray = answer.product.split(':');
      let id = tempArray[0];
      connection.query('SELECT stock_quantity, price FROM bamazon.products WHERE item_id = ?', [id], function (error, response, fields) {
        if (error) throw 'An error has occurred with selecting quantity where ID equals ' + id + ' - ' + error;
        let newQuantity = response[0].stock_quantity - parseInt(answer.units);
        let total = response[0].price * answer.units;
        if (newQuantity > -1) {
          connection.query('UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?', [newQuantity, id], function (error, response, fields) {
            if (error) throw 'An error has occurred with updating the quantity - ' + error;
            console.log('Shopkeeper: Your total came out to $' + total + '.');
            continueShopping();
          });
        } else {
          console.log('\nShopkeeper: Sorry, we are out of stock of that item!\n');
          continueShopping();
        }
      });
    })
  });
};

function continueShopping() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Shopkeeper: Would you like to continue shopping? (y/n)'
    }
  ]).then((answer) => {
    if (answer.continue.toLowerCase() === 'y') {
      greetCustomer();
    } else {
      console.log('\nThanks for shopping at BAMAZON, the adventurer\'s one stop shop!\n');
      connection.end();
    }
  });
}