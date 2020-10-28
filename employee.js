var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTable = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Millions2020!",
    database: "employeesDB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    startTracker();
  });

  //Function that starts inquirer to prompt questions from user.
function startTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        // list of options included for MVP
        "View All Employees",
        "View departments",
        "View Employees By Department",
        "View roles",
        "Add department",
        "Add role",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "EXIT"
      ]
    })
.then(function(answer) {
  //take the customer's answer
  //switch case shows what happens depending on what the customer chooses
    switch (answer.action) {
    case "View All Employees":
      viewEmployees();
      break;

    case "View Employees By Department":
      viewEmployeesByDept();
      break;

    case "View all departments":
      viewDept();
      break;
    
    case "View all roles":
      viewRoles();
      break;

    case "Add New Employee":
      addEmployee();
      break;
  
    case "Add New department":
      addDept();
      break;
    
    case "Add New Role":
      addRole();
      break;

    case "Remove Employee":
      removeEmployee();
      break;
    
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    
    case "Update Employee's Manager":
      updateEmployeeMng();
      break;
    
    case "EXIT":
      console.log("Thank you from Employee Tracker! Cheers!")
      process.exit();
    }
  });
}

viewEmployees();
viewEmployeesByDept();
viewDept();
viewRoles();
addEmployee();
addDept();
addRole();
removeEmployee();
updateEmployeeRole();
updateEmployeeMng();