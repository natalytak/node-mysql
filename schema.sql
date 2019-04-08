CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10,4) NOT NULL,
stock_quantity INTEGER(10),
product_sales DECIMAL(10,4) NOT NULL
);

CREATE TABLE departments(
department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(30) NOT NULL,
over_head_costs INTEGER(10)
);