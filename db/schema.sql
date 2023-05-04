-- Ensure that there is no pre-existing "company_db" database and create it
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE IF NOT EXISTS company_db;

-- Switch to the "company_db" database
USE company_db;

-- Create the "department" table with an auto-increment "id" column and a "name" column
CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the "role" table with an auto-increment "id" column, a "title" column, a "salary" column, and a foreign key "department_id"
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

-- Create the "employee" table with an auto-increment "id" column, "first_name" and "last_name" columns, and foreign keys "role_id" and "manager_id"
CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id),
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);