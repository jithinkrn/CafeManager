import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useDeleteCafe } from '../api/cafes';

const CafeTable = ({ data, onEdit }) => {
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    employees: 0,
    location: '',
    logo: ''
  });

  const [open, setOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState(null);

  const deleteCafeMutation = useDeleteCafe();

  const handleOpenDialog = (cafe) => {
    setSelectedCafe(cafe); 
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (selectedCafe) {
      deleteCafeMutation.mutate(selectedCafe);
    }
    setOpen(false);
  };

  const handleEditClick = (cafe) => {
    setEditingRow(cafe.id); // Set the row that is being edited
    setFormData(cafe); // Set formData to the selected row's data
    onEdit(cafe);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveClick = () => {
    // Save the edited data and exit edit mode
    onEdit(formData);  // Call parent handler to save changes
    setEditingRow(null); // Exit edit mode
  };

  const columns = [
   
    {
      headerName: 'Logo',
      field: 'logo',
      flex: 1,
      cellRenderer: (params) => {
        const logoUrl = params.value;

        return logoUrl ? (
          <img
            src={logoUrl}
            alt="logo"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ) : (
          'No Logo'
        );
      },
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      cellRendererFramework: (params) => (
        editingRow === params.data.id ? (
          <TextField
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
          />
        ) : (
          params.value
        )
      ),
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 1.5,
      cellRendererFramework: (params) => (
        editingRow === params.data.id ? (
          <TextField
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
          />
        ) : (
          params.value
        )
      ),
    },
    {
      headerName: 'Employees',
      field: 'employees',
      flex: 1,
      cellRendererFramework: (params) => (
        editingRow === params.data.id ? (
          <TextField
            name="employees"
            type="number"
            value={formData.employees}
            onChange={handleFormChange}
            fullWidth
          />
        ) : (
          params.value || 0
        )
      ),
    },
    {
      headerName: 'Location',
      field: 'location',
      flex: 1,
      cellRendererFramework: (params) => (
        editingRow === params.data.id ? (
          <TextField
            name="location"
            value={formData.location}
            onChange={handleFormChange}
            fullWidth
          />
        ) : (
          params.value
        )
      ),
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1.5,
      cellRenderer: (params) => {
        return editingRow === params.data.id ? (
          <>
            <button onClick={handleSaveClick} className="save-button">Save</button>
            <button onClick={() => setEditingRow(null)} className="cancel-button">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => handleEditClick(params.data)} className="update-button">Update</button>
            <button onClick={() => handleOpenDialog(params.data)} className="delete-button">Delete</button>
          </>
        );
      }
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        rowData={data}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        frameworkComponents={{
          Button,
        }}
      />

      <Dialog
        open={open}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedCafe?.name}? This action cannot be undone.
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

export default CafeTable;
