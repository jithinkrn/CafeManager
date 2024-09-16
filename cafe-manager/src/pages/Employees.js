import React, { useState, useEffect } from 'react';
import { useGetEmployees, useDeleteEmployee } from '../api/employees';
import EmployeeTable from '../components/EmployeeTable';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

const Employees = () => {
  const [cafeFilter, setCafeFilter] = useState(''); // State for filtering employees by café
  const [debouncedFilter, setDebouncedFilter] = useState(cafeFilter); // Debounced value
  const { data: employees, isLoading, isError, error } = useGetEmployees(debouncedFilter); // Fetch employees from API with optional café filter
  const { mutate: deleteEmployee } = useDeleteEmployee(); // Mutation hook for deleting an employee
  const navigate = useNavigate(); // For navigation between pages

  // Debounce the cafe filter input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(cafeFilter); // Update debounced value after a delay
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler); // Clear the timeout on cleanup (for example, when typing continues)
    };
  }, [cafeFilter]);

  // Handle edit action
  const handleEdit = (employee) => {
    console.log(employee);
    navigate({ to: '/edit-employee', state: { employee } });
  };

  // Handle delete action
  const handleDelete = (id) => {
    // You can add a confirmation dialog here
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="form-container">
    {/* Div to hold the filter and button */}
    <div className="filter-button-container">
      <TextField
        label="Filter by Cafe"
        value={cafeFilter}
        onChange={(e) => setCafeFilter(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => navigate({ to: '/add-employee' })}>
        Add New Employee
      </Button>
    </div>

    {/* Display employee table */}
    <EmployeeTable data={employees} onEdit={handleEdit} onDelete={handleDelete} />
  </div>
  );
};

export default Employees;
