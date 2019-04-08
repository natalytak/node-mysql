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
    loadDatabase();
  });

  function loadDatabase() {
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err; {
          for (var i = 0; i < results.length; i++) {
          console.log("----------------------------------");
          console.log(colors.red("ID: " + results[i].item_id));
          console.log(colors.blue.bold(results[i].product_name.toUpperCase()), colors.grey(results[i].department_name));
          console.log(colors.bgWhite.black.bold("Price: " + results[i].price));
        }
        start();
        return results
      }
    });
  }

  function start() {
  inquirer
  .prompt([
    {
    name: "ID",
    message: "What would you like to buy? Please enter ID:",
    type: "input",
  },
  { 
    type: "input",  
    message: "Please enter quantity",
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
    if (answer.ID === "" && answer.quantity === "") {
      console.log(colors.cyan("Invalid ID and quantity. Please enter again."));
      start();
    } else if (answer.ID === "") {
      console.log(colors.cyan("Invalid ID"));
      start();
    } else if (answer.quantity === "") {
      console.log(colors.cyan("Invalid quantity"));
      start();
    } else {
      var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: answer.ID }, function(err, res) {
      for (var i = 0; i < res.length; i++) {
          var itemsLeft = res[i].stock_quantity;
        if (itemsLeft >= answer.quantity) {
        console.log(res[i].product_name.blue.underline + "(" + answer.quantity.blue + "): successfully added to your shopping cart.");
        var cost = res[i].price * parseInt(answer.quantity);
        console.log(colors.red("Your total cost for this purchase is: $" + cost));
        var newQuantity = parseInt(itemsLeft) - parseInt(answer.quantity);

        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, [{product_sales: cost}, {item_id: answer.ID}], function(error) {
          if(error) throw err;
        });
        var queryUPDATE = "UPDATE products SET ? WHERE ?";
    connection.query(queryUPDATE, [{stock_quantity: newQuantity},
    {item_id: answer.ID}], function(error) {
        if (error) throw err;
        askAgain();
    })
        } else {
            console.log(colors.yellow("Insufficient quantity! Please choose a different item."));
            start();
        }
      }
    });
}
function askAgain() {
  inquirer
  .prompt([
    {
    type: "list",
    message: "What would you like to do now?",
    name: "again",
    choices: [
      "Make Another purchase",
      "EXIT"
    ]
  }
])
  .then(function(answer) {
    if (answer.again === "Make Another purchase") {
      loadDatabase();
    } else if (answer.again === "EXIT") {
      console.log(colors.bgWhite.red.bold("THANK YOU FOR SHOPPING WITH US!"));
      connection.end();
    }
  }) 
}
})}
//   start();
//   connection.end()
