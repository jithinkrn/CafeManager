import React, { useState, useEffect } from 'react';
import { useGetCafes, useDeleteCafe } from '../api/cafes';
import CafeTable from '../components/CafeTable';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';

const Cafes = () => {
  const [locationFilter, setLocationFilter] = useState(''); // State for filtering cafes by location
  const [debouncedFilter, setDebouncedFilter] = useState(locationFilter); // Debounced value for the filter
  const { data: cafes, isLoading } = useGetCafes(debouncedFilter); // Fetch cafes with location filter
  const { mutate: deleteCafe } = useDeleteCafe();
  const navigate = useNavigate();

  // Debounce the location filter input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(locationFilter); // Update debounced value after a delay
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler); // Clear the timeout on cleanup
    };
  }, [locationFilter]);

  const handleEdit = (cafe) => {
    console.log("Cafe data:", cafe);  // Log cafe data
    navigate({ to: '/edit-cafe', state: { cafe } });
  };

  const handleDelete = (id) => deleteCafe(id);

  if (isLoading) return <CircularProgress />;

  return (
    <div className="form-container">
      {/* Div to hold the filter and button */}
    <div className="filter-button-container">
      <TextField
        label="Filter by Location"
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => navigate({ to: '/add-cafe' })}>Add New Café</Button>
    </div>

    {/* Display cafe table */}
    <CafeTable data={cafes} onEdit={handleEdit} onDelete={handleDelete} />
  </div>
  );
};

export default Cafes;
