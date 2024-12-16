const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();



// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Custom validation function
const validateEmployee = (data) => {
  const errors = {};

  // Employee ID
  if (!data.employee_id || data.employee_id.trim() === '') {
    errors.employee_id = 'Employee ID is required.';
  }

  // Name
  if (!data.emp_name || data.emp_name.trim() === '') {
    errors.emp_name = 'Name is required.';
  }

  // Email
  if (
    !data.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = 'Valid email is required.';
  }

  // Phone Number
  if (
    !data.phone_number ||
    !/^\d{10}$/.test(data.phone_number)
  ) {
    errors.phone_number = 'Phone number must be a 10-digit number.';
  }

  // Department
  if (
    !data.department ||
    !['HR', 'Engineering', 'Marketing'].includes(data.department)
  ) {
    errors.department = 'Department must be HR, Engineering, or Marketing.';
  }

  // Date of Joining
  const now = new Date();
  const joiningDate = new Date(data.date_of_joining);
  if (!data.date_of_joining || joiningDate > now) {
    errors.date_of_joining = 'Date of joining cannot be in the future.';
  }

  // Role
  if (!data.role || data.role.trim() === '') {
    errors.role = 'Role is required.';
  }

  return errors;
};

// Route to handle adding an employee
app.post('/api/add', (req, res) => {
  const employee = req.body;

  // Validate employee data
  const errors = validateEmployee(employee);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Validation errors occurred.', errors });
  }

  // Insert employee into the database
  const sql = `
    INSERT INTO employees (employee_id, emp_name, email, phone_number, department, date_of_joining, role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    employee.employee_id,
    employee.emp_name,
    employee.email,
    employee.phone_number,
    employee.department,
    employee.date_of_joining,
    employee.role,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting employee:', err.message);
      return res.status(500).json({ message: 'Database error occurred.' });
    }

    res.status(200).json({ message: 'Employee added successfully!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
