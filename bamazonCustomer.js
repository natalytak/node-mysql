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
      console.log(answer.ID, answer.quantity);
      console.log("Checking availability of the item...");

      var query = "SELECT product_name, price, stock_quantity FROM products WHERE ?";
    connection.query(query, { item_id: answer.ID }, function(err, res) {
      for (var i = 0; i < res.length; i++) {
          var itemsLeft = res[i].stock_quantity;
        console.log("Left: " + itemsLeft);
        if (itemsLeft >= answer.quantity) {
        console.log(res[i].product_name + "(" + answer.quantity + "): successfully added to your shopping cart.");
        var cost = res[i].price * parseInt(answer.quantity);
        console.log("Your total cost for this purchase is: $" + cost);
        var newQuantity = parseInt(itemsLeft) - parseInt(answer.quantity);
        console.log(newQuantity);
        var queryUPDATE = "UPDATE products SET ? WHERE ?";
    connection.query(queryUPDATE, [{stock_quantity: newQuantity},
    {item_id: answer.ID}], function(error) {
        if (error) throw err;
        console.log("Updating our database...");
        loadDatabase();
    })
        } else {
            console.log("Insufficient quantity! Please choose a different item.");
            start();
        }
      }
      // runSearch();
    });
  });
}

//   start();
//   connection.end();
