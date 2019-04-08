const Table = require('cli-table');

// console.table([
//     {
//       name: 'foo',
//       age: 10
//     }, {
//       name: 'bar',
//       age: 20
//     }
//   ]);

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
        // start();
        return results
      }
    });
    })}