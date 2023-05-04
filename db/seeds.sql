INSERT INTO department (name)
VALUES 
('Customer Sales'), 
('Body'), 
('Fabrication'), 
('Detailing'), 
('Performance');

INSERT INTO role (title, salary, department_id)
VALUES
('Salesman', 32000, 1),
('Mechanic', 60000, 2),
('Fabricator', 70000, 3),
('Detailer', 35000, 4),
('Tuner', 82000, 5),


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Ken','Block', 1, NULL),
('Unc', 'Ruckus', 2, 1),
('Samual','Jack', 3, NULL),
('Ash', 'Ketchum', 4, 3),
('Leeroy', 'Jenkins', 5, NULL),
