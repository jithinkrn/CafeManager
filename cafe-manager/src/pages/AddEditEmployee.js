import React, { useState, useEffect } from 'react';
import ReusableTextBox from '../components/ReusableTextBox';
import { Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, MenuItem, Select,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle  } from '@mui/material';
import { useAddEmployee, useEditEmployee } from '../api/employees';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useGetCafes } from '../api/cafes';

const AddEditEmployee = () => {
  const location = useLocation();
  const isEditing = !!(location.state?.employee);
  const { data: cafes } = useGetCafes(); // Get available cafes for the dropdown
 
  
  // Initial employee state without the id and start_date fields
  const initialEmployeeState = isEditing ? {
    ...location.state.employee,
    cafe_id: cafes ? cafes.find((cafe) => cafe.name === location.state.employee.cafe)?.id : '', // Set the correct cafe_id based on cafe name  // Initialize with empty cafe_id, this will be set later
  } : {
    name: '',
    email_address: '',
    phone_number: '',
    gender: '',
    cafe_id: '',
  };

  const [employee, setEmployee] = useState(initialEmployeeState);
  const [initialEmployee, setInitialEmployee] = useState(employee);
  const [error, setError] = useState({});

  const { mutate: addEmployee } = useAddEmployee();
  const { mutate: editEmployee } = useEditEmployee();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  // Validation function for phone number
  const validatePhoneNumber = (number) => {
    const phonePattern = /^[89]\d{7}$/;  // Singapore phone validation (starts with 8 or 9, 8 digits)
    return phonePattern.test(number);
  };

  const handleSubmit = () => {
    const newError = {};
  
    // Name Validation
    if (employee.name.length < 2 || employee.name.length > 20) {
      newError.name = 'Name must be between 2 and 20 characters';
    }
  
    // Email Validation
    if (!/\S+@\S+\.\S+/.test(employee.email_address)) {
      newError.email_address = 'Please enter a valid email address';
    }
  
    // Phone Number Validation
    if (!validatePhoneNumber(employee.phone_number)) {
      newError.phone_number = 'Phone number must start with 8 or 9 and be 8 digits long';
    }
  
    setError(newError);
  
    // Proceed only if no validation errors
    if (Object.keys(newError).length === 0) {
      // Ensure that cafe_id is set to null if "None" is selected, and all other fields are included in the payload
      const payload = {
        ...employee,
        cafe_id: employee.cafe_id || null  // Set cafe_id to null if "None" was selected
      };
  
      // Check if it's an edit or an add operation
      if (isEditing) {
        editEmployee(payload);  // Call editEmployee mutation with the full payload
      } else {
        addEmployee(payload);  // Call addEmployee mutation with the full payload
      }
  
      navigate({ to: '/employees' });
    }
  };

  useEffect(() => {
    if (isEditing && cafes && employee.cafe) {
      // Find the matching cafe_id by comparing employee.cafe (name) with cafes array
      const matchedCafe = cafes.find((cafe) => cafe.name === employee.cafe);
      if (matchedCafe) {
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          cafe_id: matchedCafe.id,  // Set the matched cafe_id
        }));
      }
    }
  }, [isEditing, cafes, employee.cafe]);

   // Handle the "Cancel" button click
   const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setOpenDialog(true);  // Open the confirmation dialog if there are unsaved changes
    } else {
      navigate({ to: '/employees' });  // Navigate away if no unsaved changes
    }
  };

   // Check if there are unsaved changes by comparing current and initial form state
   const hasUnsavedChanges = () => {
    return (
      employee.name !== initialEmployee.name ||
      employee.email_address !== initialEmployee.email_address ||
      employee.phone_number !== initialEmployee.phone_number ||
      employee.gender !== initialEmployee.gender ||
      employee.cafe_id !== initialEmployeeState.cafe_id
  
    );
  };

   // Handle confirmation dialog actions
   const handleConfirmLeave = () => {
    setOpenDialog(false);
    navigate({ to: '/employees' });  // Confirm navigation and close the dialog
  };

  const handleCancelLeave = () => {
    setOpenDialog(false);  // Just close the dialog if user chooses not to navigate
  };

  return (
    <div className="form-container">
      <ReusableTextBox
        label="Name"
        value={employee.name}
        onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
        error={!!error.name}
        helperText={error.name}
      />
      <ReusableTextBox
        label="Email Address"
        value={employee.email_address}
        onChange={(e) => setEmployee({ ...employee, email_address: e.target.value })}
        error={!!error.email_address}
        helperText={error.email_address}
      />
      <ReusableTextBox
        label="Phone Number"
        value={employee.phone_number}
        onChange={(e) => setEmployee({ ...employee, phone_number: e.target.value })}
        error={!!error.phone_number}
        helperText={error.phone_number}
      />

      <FormControl component="fieldset" style={{ marginTop: '16px' }}>
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          row
          value={employee.gender}
          onChange={(e) => setEmployee({ ...employee, gender: e.target.value })}
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth style={{ marginTop: '16px' }}>
        <FormLabel>Café (optional)</FormLabel>
        <Select
          value={employee.cafe_id || "None"}
          onChange={(e) => setEmployee({ 
            ...employee, 
            cafe_id: e.target.value === "None" ? null : e.target.value  // Set cafe_id to null if "None" is selected
          })}
        >
          <MenuItem value="None">
            <em>None</em> {/* This represents no café selected */}
          </MenuItem>
          {cafes && cafes.map((cafe) => (
            <MenuItem key={cafe.id} value={cafe.id}>{cafe.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
        {isEditing ? 'Update Employee' : 'Add Employee'}
      </Button>
      <Button variant="outlined" color="secondary"  onClick={handleCancel} style={{ marginTop: '16px', marginLeft: '8px' }}>
        Cancel
      </Button>
      <Dialog open={openDialog} onClose={handleCancelLeave}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Are you sure you want to leave this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCancelLeave} color="primary">
            Stay
          </Button>
          <Button variant="outlined" onClick={handleConfirmLeave} color="secondary">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEditEmployee;
