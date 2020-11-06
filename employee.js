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

//Function view all employees
function viewEmployees() {
  var query = `SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS department, role.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN role on employees.role_id = role.id 
  LEFT JOIN departments on role.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`;
  connection.query(query, function(err, query){
      console.table(query);
      startApp();
  });
};



//viewEmployeesByDept();
function viewEmployeesByDept() {
  var query =`SELECT departments.name AS department, employees.id, employees.first_name, employees.last_name, role.title FROM employees LEFT JOIN role on 
  employees.role_id = role.id LEFT JOIN departments departments on role.department_id = departments.id WHERE departments.id;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
});
};


//viewDept();
function viewDept() {
  var query = `select id AS Dept_ID, name AS departments from departments;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
  });
};


//viewRoles();
function viewRoles() {
  var query = `select id AS Role_ID, title, salary AS Salaries from role;`;
  connection.query(query, function(err, query){
    console.table(query);
    startApp();
  });
};


//addEmployee() prompts for full employee info

function addEmployee() {
  //arrays to display prompt choices from database items 
  var roleChoice = [];
  connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      var roleList = resRole[i].title;
      roleChoice.push(roleList);
    };

    var deptChoice = [];
    connection.query("SELECT * FROM departments", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        var deptList = resDept[i].name;
        deptChoice.push(deptList);
    }
    
  inquirer
    .prompt([
    {
      name: "firstName",
      type: "input",
      message: "Enter employee's first name:"
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter employee's last name:"
    },
    {
      name: "role_id",
      type: "rawlist",
      message: "Select employee role:",
      choices: roleChoice
    },
    {
      name: "department_id",
      type: "rawlist",
      message: "Select employee's department:",
      choices: deptChoice
    },

  ])
    .then(function(answer) {
      //for loop to retun 
      var chosenRole;
        for (var i = 0; i < resRole.length; i++) {
          if (resRole[i].title === answer.role_id) {
            chosenRole = resRole[i];
          }
        };

        var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            chosenDept = resDept[i];
          }
        };
      //connection to insert response into database  
      connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: chosenRole.id,
          department_id: chosenDept.id
        },
        function(err) {
          if (err) throw err;
          console.log("Employee " + answer.firstName + " " + answer.lastName + " successfully added!");
          startApp();
        }
      );
    })
   });
  })
};



//addDept();
function addDept() {
  inquirer
    .prompt([
    {
      name: "dept",
      type: "input",
      message: "Enter new department's name:"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO departments SET ?",
      {
        name: answer.dept
      },
      function(err) {
        if (err) throw err;
        console.log("Department " + answer.dept + " successfully added!");
        startApp();
      }
    );
  });
};

//add role
function addRole() {
  var deptChoice = [];
    connection.query("SELECT * FROM departments", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        var deptList = resDept[i].name;
        deptChoice.push(deptList);
    }

  inquirer
  .prompt([
  {
    name: "title",
    type: "input",
    message: "Enter new role's name:"
  },
  {
    name: "salary",
    type: "number",
    message: "Enter new role's salary:"
  },
  {
    name: "department_id",
    type: "rawlist",
    message: "Select employee's department:",
    choices: deptChoice
  }
])
.then(function(answer) {

  var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            chosenDept = resDept[i];
          }
        };

  connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: chosenDept.id
    },
    function(err) {
      if (err) throw err;
      console.log("New role " + answer.title + " successfully added!");
      startApp();
    }
  );
});
})
};



//removeEmployee();

//Function to remove employee
function removeEmployee() {
  var empChoice = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        var empList = resEmp[i].name;
        empChoice.push(empList);
    };

  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "rawlist",
        message: "Select the employee you would like to remove:",
        choices: empChoice
      },
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employee_id) {
            chosenEmp = resEmp[i];
        }
      };

//     connection.query(
//       "DELETE FROM employees WHERE id=?",
//       [chosenEmp.id],

//       function(err) {
//         if (err) throw err;
//         console.log("Employee successfully removed!");
//         startApp();
//       }
//     );
//    });
//   })
// };


//updateEmployeeRole();
function updateEmployeeRole() {
  var empChoice = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        var empList = resEmp[i].name;
        empChoice.push(empList);
    };
    
    var roleChoice = [];
  connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      var roleList = resRole[i].title;
      roleChoice.push(roleList);
    };

    inquirer
    .prompt([
    {
      name: "employee_id",
      type: "rawlist",
      message: "Select the employee you would like to update:",
      choices: empChoice
    },
    {
      name: "role_id",
      type: "rawlist",
      message: "Select employee's new role:",
      choices: roleChoice
    }
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employee_id) {
            chosenEmp = resEmp[i];
        }
      };

    var chosenRole;
      for (var i = 0; i < resRole.length; i++) {
        if (resRole[i].title === answer.role_id) {
          chosenRole = resRole[i];
        }
      };
      connection.query(
        "UPDATE employees SET role_id = ? WHERE id = ?",
        [chosenRole.id, chosenEmp.id],
        function(err) {
          if (err) throw err;
          console.log("Employee new role successfully updated!");
          startApp();
        }
      );
    })
   })
  })
};


updateEmployeeMng();