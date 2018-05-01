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
  menuOptions();
});

let menuOptions = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'menuOptions',
      message: 'Shopkeeper: Welcome manager sir! What can I help you with today?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
  ]).then((answer) => {
    switch(answer.menuOptions) {
      case 'View Products for Sale':
        connection.query('SELECT * FROM bamazon.products WHERE stock_quantity > 0', (error, response) => {
          if (error) throw 'An error has occurred with selecting data - ' + error;
          console.table(response);
          anythingElse();
        });
        break;
      case 'View Low Inventory':
        connection.query('SELECT * FROM bamazon.products WHERE stock_quantity < 5', (error, response) => {
          if (error) throw 'An error has occurred with selecting data - ' + error;
          console.table(response);
          anythingElse();
        });
        break;
      case 'Add to Inventory':
        addToInventory();
        break;
      case 'Add New Product':
        addNewProduct();
        break;
      default:
        //do nothing
    }
  });
};

let anythingElse = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'menuOptions',
      message: 'Shopkeeper: Anything else I can help you with today boss man?',
      choices: ['Yes', 'No']
    }
  ]).then((answer) => {
    switch(answer.menuOptions) {
      case 'Yes':
        menuOptions();
        break;
      case 'No':
        console.log('\nShopkeeper: Very well! Thanks for stopping by, sir!\n');
        connection.end();
        break;
    }
  });
};

let queryItemsForSale = new Promise((resolve, reject) => {
  connection.query('SELECT * FROM bamazon.products', function (error, response) {
    if (error) throw 'An error has occurred with selecting data - ' + error;
    let productArray = [],
      arrayItem = '';
    response.forEach((item) => {
      arrayItem = item.item_id + ': ' + item.product_name + ' ----- ' + item.stock_quantity;
      productArray.push(arrayItem);
    });
    resolve(productArray);
  });
});

let addToInventory = () => {
  queryItemsForSale.then((productArray) => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'product',
        message: 'Shopkeeper: What items would you like to add to the inventory?',
        choices: productArray
      },
      {
        type: 'input',
        name: 'units',
        message: 'Shopkeeper: How many units would you like to add?'
      }
    ]).then((answer) => {
      let tempArray = answer.product.split(':');
      let id = tempArray[0];
      connection.query('SELECT stock_quantity, price FROM bamazon.products WHERE item_id = ?', [id], function (error, response, fields) {
        if (error) throw 'An error has occurred with selecting quantity where ID equals ' + id + ' - ' + error;
        let newQuantity = response[0].stock_quantity + parseInt(answer.units);
        connection.query('UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?', [newQuantity, id], function (error, response, fields) {
          if (error) throw 'An error has occurred with updating the quantity - ' + error;
          console.log('\nShopkeeper: I\'ve updated our inventory record.\n');
          anythingElse();
        });
      });
    });
  });
};

let addNewProduct = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'productName',
      message: 'Shopkeeper: What is the name of the item?',
    },
    {
      type: 'input',
      name: 'departmentName',
      message: 'Shopkeeper: What department does this fall under?'
    },
    {
      type: 'input',
      name: 'price',
      message: 'Shopkeeper: How much do you want to sell this for?'
    },
    {
      type: 'input',
      name: 'stockQuantity',
      message: 'Shopkeeper: Lastly, how many of these did you bring for us to sell?'
    }
  ]).then((answer) => {
    console.log('Shopkeeper: It shall be done, milord.');
    let price = parseFloat(answer.price).toFixed(2);
    let quantity = parseInt(answer.stockQuantity);
    connection.query('INSERT INTO bamazon.products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)', [answer.productName, answer.departmentName, price, quantity], (error, response, fields) => {
      if (error) throw 'An error has occurred with inserting a row - ' + error;
      anythingElse();
    });
  });
};