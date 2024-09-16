import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useDeleteEmployee } from '../api/employees';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const EmployeeTable = ({ data, onEdit }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null); // To track which employee to delete
  const [open, setOpen] = useState(false); // Control the dialog state
  const deleteEmployeeMutation = useDeleteEmployee(); // Delete mutation hook

  // Handle opening the confirmation dialog
  const handleOpenDialog = (employee) => {
    setSelectedEmployee(employee); 
    setOpen(true); 
  };

  // Handle closing the confirmation dialog
  const handleCloseDialog = () => {
    setOpen(false); 
  };

  // Handle delete after confirmation
  const handleDeleteConfirm = () => {
    if (selectedEmployee) {
      deleteEmployeeMutation.mutate(selectedEmployee); // Pass the selected employee to delete
    }
    setOpen(false); // Close the dialog after delete
  };

  // Handle when the user clicks "Edit" (or "Update")
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee); // Set formData to the selected row's data
    onEdit(employee);
  };

  // Define the columns for the employee table
  const columns = [
    { headerName: 'Employee ID', field: 'id', flex: 1 },
    { headerName: 'Name', field: 'name', flex: 1.5 },
    { headerName: 'Email Address', field: 'email_address', flex: 1.5 },
    { headerName: 'Phone Number', field: 'phone_number', flex: 1.5 },
    { headerName: 'Days Worked', field: 'days_worked', flex: 1 },
    { headerName: 'Café', field: 'cafe', flex: 1 },

    // Define a column for actions like Edit and Delete
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1.5,
      cellRenderer: (params) => {
        return (
          <>
            <button onClick={() => handleEditClick(params.data)} className="update-button">Update</button>
            <button onClick={() => handleOpenDialog(params.data)} className="delete-button">Delete</button>
          </>
        );
      },
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={data} // Row data is passed as a prop (array of employees)
        columnDefs={columns} // Column definitions
        pagination={true} // Enable pagination
        paginationPageSize={10} // Page size for pagination
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedEmployee?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained" color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="outlined" color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EmployeeTable;
