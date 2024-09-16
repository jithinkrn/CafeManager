import React, { useState, useEffect } from 'react';
import ReusableTextBox from '../components/ReusableTextBox';
import { Button,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAddCafe, useEditCafe } from '../api/cafes';
import { useNavigate, useLocation } from '@tanstack/react-router';


const AddEditCafe = () => {
  const location = useLocation();  
  const isEditing = !!(location.state?.cafe);

  const [cafe, setCafe] = useState(isEditing ? location.state?.cafe : { name: '', description: '', location: '', logo: '' });
  const [initialCafe, setInitialCafe] = useState(cafe);
  const [logoFile, setLogoFile] = useState(null); 
  const [preview, setPreview] = useState(isEditing && cafe.logo ? cafe.logo : ''); // For logo preview
  const { mutate: addCafe } = useAddCafe();
  const { mutate: editCafe } = useEditCafe();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  // Handle file change for logo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) { // Max 2MB validation
      setLogoFile(file);
      setPreview(URL.createObjectURL(file)); // Preview the selected logo image
    } else {
      alert('File size should not exceed 2MB');
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('name', cafe.name);
    formData.append('description', cafe.description);
    formData.append('location', cafe.location);
    if (logoFile) {
      formData.append('logo', logoFile); // Append the file if it exists
    }

    if (isEditing) {
      formData.append('id', cafe.id); // Ensure the ID is sent for editing
      editCafe(formData);
    } else {
      addCafe(formData);
    }
    navigate({ to: '/cafes' });
  };

  // Handle the "Cancel" button click
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setOpenDialog(true);  // Open the confirmation dialog if there are unsaved changes
    } else {
      navigate({ to: '/cafes' });  // Navigate away if no unsaved changes
    }
  };

   // Check if there are unsaved changes by comparing current and initial form state
   const hasUnsavedChanges = () => {
    return (
      cafe.name !== initialCafe.name ||
      cafe.description !== initialCafe.description ||
      cafe.location !== initialCafe.location ||
      !!logoFile // true if a new file has been selected
    );
  };

   // Handle confirmation dialog actions
   const handleConfirmLeave = () => {
    setOpenDialog(false);
    navigate({ to: '/cafes' });  // Confirm navigation and close the dialog
  };

  const handleCancelLeave = () => {
    setOpenDialog(false);  // Just close the dialog if user chooses not to navigate
  };

  return (
    <div className="form-container">
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span" color="primary">
          Add Logo
        </Button>
      </label>

      {preview && (
        <div className="logo-preview">
          <img src={preview} alt="No logo Added" style={{ maxWidth: '150px', marginTop: '10px' }} />
        </div>
      )}
      <ReusableTextBox label="Name" value={cafe.name} style={{ marginTop: '10px' }} onChange={(e) => setCafe({ ...cafe, name: e.target.value })} />
      <ReusableTextBox label="Description" value={cafe.description} onChange={(e) => setCafe({ ...cafe, description: e.target.value })} />
      <ReusableTextBox label="Location" value={cafe.location} onChange={(e) => setCafe({ ...cafe, location: e.target.value })} />
      <Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>Submit</Button>
      <Button variant="outlined" color="secondary" onClick={handleCancel} style={{ marginTop: '16px', marginLeft: '8px' }}>Cancel</Button>
      {/* Confirmation Dialog for Unsaved Changes */}
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

export default AddEditCafe;
