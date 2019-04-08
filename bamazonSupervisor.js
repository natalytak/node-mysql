const Table = require('cli-table');

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
            "View Product Sales by Department",
            "Create New Department",
            "EXIT"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
              case "View Product Sales by Department":
                  loadDatabase();
                  break;
              case "Create New Department":
                  createDepartment();
                  break;
              case "EXIT":
              connection.end();
              break;
            }
        })
}

function createDepartment() {
  console.log("Creating new department...".green);
  inquirer
    .prompt([
      {
      name: "department",
      message: "What is the name of the NEW department you'd like to add?",
      type: "input",
    }
  ])
  .then(function(answer) {
    // if (answer.department === "") {
    //   console.log(colors.cyan("Invalid department name. Please enter again."));
    //   createDepartment();
    // } else {
    //   var query = "INSERT INTO products SET ?";
    //   connection.query(query, { 
    //     department_name: answer.department,
    //   }, function(err) {
    //         if (err) throw err;
    //         console.log(colors.red("You added " + answer.department + " to the list of products."));
            checkAction();
        })
       }
//   }
// )}

  function loadDatabase() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err; {
            for (var i = 0; i < results.length; i++) {
            var productSales =  results[i].product_sales;
            }
    };
    connection.query("SELECT * FROM departments", function(err, results) {
      if (err) throw err; {
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales']
           , colWidths: [20, 20, 20, 20]
        });
         
          for (var i = 0; i < results.length; i++) {
            table.push(
                [results[i].department_id, results[i].department_name, results[i].over_head_costs, productSales]
            );
            console.log(table.toString());
        }
        checkAction();
        return results
      }
    });
    }
    )}