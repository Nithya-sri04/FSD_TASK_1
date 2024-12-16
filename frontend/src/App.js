import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employee_id: '',
    emp_name: '',
    email: '',
    phone_number: '',
    department: '',
    date_of_joining: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const departments = ['HR', 'Engineering', 'Marketing'];

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) newErrors.employee_id = 'Employee ID is required.';
    if (!formData.emp_name) newErrors.emp_name = 'Name is required.';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid email is required.';
    if (!formData.phone_number || !/^\d{10}$/.test(formData.phone_number))
      newErrors.phone_number = 'Phone number must be a 10-digit number.';
    if (!formData.department) newErrors.department = 'Department is required.';
    if (!formData.date_of_joining || new Date(formData.date_of_joining) > new Date())
      newErrors.date_of_joining = 'Date of joining cannot be in the future.';
    if (!formData.role) newErrors.role = 'Role is required.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear errors on change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/add', formData);
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setFormData({
        employee_id: '',
        emp_name: '',
        email: '',
        phone_number: '',
        department: '',
        date_of_joining: '',
        role: '',
      });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error adding employee.');
      setSuccessMessage('');
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      employee_id: '',
      emp_name: '',
      email: '',
      phone_number: '',
      department: '',
      date_of_joining: '',
      role: '',
    });
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="employee-form-container">
      <h1>Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
          />
          {errors.employee_id && <p className="error">{errors.employee_id}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="emp_name">Name:</label>
          <input
            type="text"
            id="emp_name"
            name="emp_name"
            value={formData.emp_name}
            onChange={handleChange}
          />
          {errors.emp_name && <p className="error">{errors.emp_name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number:</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
          {errors.phone_number && <p className="error">{errors.phone_number}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && <p className="error">{errors.department}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="date_of_joining">Date of Joining:</label>
          <input
            type="date"
            id="date_of_joining"
            name="date_of_joining"
            value={formData.date_of_joining}
            onChange={handleChange}
          />
          {errors.date_of_joining && <p className="error">{errors.date_of_joining}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          {errors.role && <p className="error">{errors.role}</p>}
        </div>

        <button type="submit">Add Employee</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default EmployeeForm;

