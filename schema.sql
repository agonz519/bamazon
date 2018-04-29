DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(7,2) NOT NULL DEFAULT 0.00,
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("short sword", "weapons", 100.00, 5),
       ("long sword", "weapons", 150.00, 3),
       ("leather shield", "weapons", 75.00, 2),
       ("iron shield", "weapons", 100.00, 3),
       ("short bow", "weapons", 70.00, 2),
       ("wooden arrows", "weapons", 1.00, 200)
       ("chain mail", "armor", 300.00, 2),
       ("iron helmet", "armor", 200.00, 1),
       ("cloak", armor, 90.00, 4),
       ("healing potion", "pharmacy", 30.00, 10),
       ("stamina potion", "pharmacy", 20.00, 10),
       ("strength potion", "pharmacy", 50.00, 5),
       ("fireball spell", "magic", 100.00, 3),
       ("teleport spell", "magic", 999.99, 1),
       ("tent", "outdoors", 499.99, 5),
       ("sleeping bag", "outdoors", 149.75, 2),
       ("BBQ spit", "outdoors", 200.00, 1),
       ("beef jerky", "food", 12.99, 20),
       ("fruit box", "food", 8.99, 15),
       ("coffee", "food", 2.00, 40),
       ("juice", "food", 3.00, 50);

SELECT * FROM products;
