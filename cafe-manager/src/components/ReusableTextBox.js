import React from 'react';
import { TextField } from '@mui/material';

const ReusableTextBox = ({ label, value, onChange, error, helperText, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};

export default ReusableTextBox;
