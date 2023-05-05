const inquirer = require('inquirer')
const mysql = require('mysql2')
const logo = require('asciiart-logo')
require('dotenv').config()


const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: process.env.PASSWORD,
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
);


function menu() {
    inquirer
    .prompt([
        {
            type: 'list',
                name: 'options',
                message: "What would you like to do?",
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a roles',
                    'Add an employee',
                    'Update an employee roles',
                    'Quit'
                ]
            }
        ])
        .then(res => {
            
            switch (res.options) {
                case 'View all departments':
                    viewDepartments()
                    break;
                    
                    case 'View all roles':
                        viewRoles()
                        break;
                        
                        case "View all employees":
                            viewEmployees()
                            break;
                            
                            case 'Add a department':
                                addDepartment()
                    break;

                    case 'Add a roles':
                        addRole()
                        break;
                        
                        case 'Add an employee':
                            addEmployee()
                            break;
                            
                            case 'Update an employee roles':
                                updateEmployee()
                                break;
                                
                                default:
                                    quitApp()
                                    break;
                                }
                            })
                        }

function viewDepartments() {
    
    db.query('SELECT * FROM department', (error, data) => {
        console.table(data)
        menu()
    })
}

function addDepartment() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'deptName',
            message: "What is the name of the department?",
        }
    ])
    .then(res => {
        
        db.query('INSERT INTO department (name) VALUES (?)', res.deptName, (error, data) => {
            console.log('Department successfully added!')
            menu()
        })
    })
}

function viewRoles() {
    
    db.query('SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department ON roles.department_id = department.id;', (error, data) => {
        console.table(data)
        menu()
    })
}

function addRole() {   
    db.promise().query('SELECT * FROM department')
    .then(([data]) => { 
        const deptChoices = data.map(({ id, name }) => ({ name: name, value: id }))
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: "What is the name of the roles?",
                },
                
                {
                    type: 'input',
                    name: 'salary',
                    message: "What is the salary of the roles?",
                },
                
                {
                    type: 'list',
                    name: 'department',
                    message: "What department will this roles be added to?",
                    choices: deptChoices
                }]
                )
                
                .then(res => {
                    
                    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [res.title, res.salary, res.department], (error, data) => {
                        console.log('roles successfully added!')
                        menu()
                    })
                })
            })
        }
        
        
        function viewEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;", (error, data) => {
        console.table(data)
        menu()
    })
}


function addEmployee() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the first name of the new employee?",
        },
        
        {
            type: 'input',
            name: 'last_name',
            message: "What is the last name of the new employee?",
        }
    ])
    .then(res => {
        const firstName = res.first_name
        const LastName = res.last_name
        
        db.promise().query('SELECT * FROM roles')
        .then(([data]) => {                  
            const roleChoices = data.map(({ id, title }) => ({
                name: title,
                value: id
            }))
            
            
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: "What roles will be filled by the new employee?",
                        choices: roleChoices
                    }
                ])
                .then(res => {
                    const roles = res.roles                   
                    
                    db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL')
                    .then(([data]) => {                               
                        const managerChoices = data.map(({ first_name, last_name, id }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                        }))
                        
                        managerChoices.push({ name: "None", value: null });
                        inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: "What manager will this roles be reporting to?",
                                choices: managerChoices
                            }
                        ])
               
                .then(res => {                                          
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, LastName, roles, res.manager], (error, data) => {
                console.log('Employee successfully added!')
                menu()
            })
        })
    })
})
})
})
}

function updateEmployee() {
    
    db.promise().query('SELECT * FROM employee')
    .then(([data]) => {
        
        const employeeChoices = data.map(({ id, first_name, last_name }) =>
        ({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        inquirer
        .prompt([
            {
                name: 'employee',
                message: "Which employee would you like to update?",
                type: 'list',
                choices: employeeChoices
            }
        ])
        .then(res => {
            const employee = res.employee
            
            db.promise().query('SELECT * FROM roles')
            .then(([data]) => {

            const roleChoices = data.map(({ id, title }) => ({
                name: title,
                value: id
            }))
            inquirer
            .prompt([
                    {
                        name: 'roles',
                        message: 'Which new roles would you like to assign to this employee?',
                        type: 'list',
                        choices: roleChoices
                    }
                ]).then(res => {
                    const roles = res.roles
                    
                    db.promise().query('SELECT * FROM employee WHERE manager_id IS NULL')
                    .then(([data]) => {
                        
                        const managerChoices = data.map(({ first_name, last_name, id }) => ({
                            name: `${first_name} ${last_name}`,
                            value: id
                    }
                    ));
                    inquirer
                    .prompt([
                        {
                            name: 'manager',
                            message: 'Which new manager will this employee report to?',
                            type: 'list',
                            choices: managerChoices
                        }
                    ]).then(res => {
                        
                        db.query('UPDATE employee (employee, role_id, manager_id) values (?, ?, ?)', [employee, roles, res.manager], function (err, data) {
                            console.log('Employee update successful!')
                            menu()
                        })
                    })
                })
            })
        })
    })
})
}

function quitApp() {
    console.log("Goodbye!")
    process.exit()
}
startApp()

function startApp() {
    console.log(
        logo({
            name: 'Employee Database',
            logoColor: 'bold-green',
        }).render())

    menu()
}