var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    checkAction();
  });

  function checkAction() {
      inquirer
      .prompt({
              name: "action",
              type: "list",
              message: "What would you like to do?",
              choices: [
              "View products for sale",
              "View Low Inventory",
              "Add Inventory",
              "Add New Product",
              "Exit"
              ]
          })
          .then(function(answer) {
              switch (answer.action) {
                case "View products for sale":
                    loadDatabase();
                    break;
                case "View Low Inventory":
                    lowInventory();
                    break;
                case "Add Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Exit":
                connection.end();
                break;
              }
          })
  }

  function loadDatabase() {
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err; {
          for (var i = 0; i < results.length; i++) {
          console.log("----------------------------------");
          console.log(colors.red("ID: " + results[i].item_id));
          console.log(colors.blue.bold(results[i].product_name.toUpperCase()), colors.grey(results[i].department_name));
          console.log(colors.bgWhite.black.bold("Price: " + results[i].price), colors.green("Left in stock: " + results[i].stock_quantity));
        }
        checkAction();
        return results
      }
    });
  }

  function lowInventory() {
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, results) {
        if (err) throw err; {
          for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 5) {
                console.log(colors.red(results[i].product_name));
            }
          }
          checkAction();
          return results
        }
      })
  }

function addInventory() {
  inquirer
  .prompt([
    {
    name: "ID",
    message: "Please enter item's ID:",
    type: "input",
  },
  { 
    type: "input",  
    message: "Please enter quantity you would like to add:",
    name: "quantity",
    validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
  }
])
  .then(function(answer) {
      var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: answer.ID }, function(err, res) {
      for (var i = 0; i < res.length; i++) {
      var itemsLeft = res[i].stock_quantity;
      var product = res[i].product_name;
      var newQuantity = parseInt(itemsLeft) + parseInt(answer.quantity);
      var queryUPDATE = "UPDATE products SET ? WHERE ?";
      connection.query(queryUPDATE, [{stock_quantity: newQuantity},
      {item_id: answer.ID}], function(error) {
          if (error) throw err;
          console.log(colors.red("You added " + answer.ID + " more " + product.red));
          checkAction();
      })
     }
    }
     )}
  )}

  function addProduct() {
    inquirer
    .prompt([
      {
      name: "product",
      message: "Please enter product's name:",
      type: "input",
    },
    {
      name: "price",
      message: "Please enter the price:",
      type: "input",
    },
    {
      name: "quantity",
      message: "Please enter quantity:",
      type: "input",
    },
    { 
      name: "department", 
      message: "Please pick the department:",
      type: "list",
      choices: [
        "clothes",
        "household items",
        "food",
        "beauty",
        "other"
      ]
    }
  ])
  .then(function(answer) {
    // if (answer.department === "add new department") {
    //       addDepartment();
    // } else {
      console.log(answer.product, answer.price, answer.quantity, answer.department);
        var query = "INSERT INTO products SET ?";
      connection.query(query, { 
        product_name: answer.product,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.quantity,
      }, function(err) {
            if (err) throw err;
            console.log(colors.red("You added " + answer.product + " to the table."));
            checkAction();
        })
       }
      
       )}
