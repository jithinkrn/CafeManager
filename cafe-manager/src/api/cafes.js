import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// // Determine the API URL based on the environment
// const API_URL = process.env.NODE_ENV === 'production'
//   ? 'http://localhost:5000/api/cafes'  // Production API URL (using port 5000)
//   : 'http://localhost:5148/api/cafes';  // Development API URL (use the current backend port)

// Use the environment variable REACT_APP_API_URL
const API_URL = process.env.REACT_APP_API_URL_CAFES;
  

// Fetch Cafes with optional location filtering
export const useGetCafes = (location = '') => {
  return useQuery({
    queryKey: ['cafes', location],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}?location=${location}`);
      return data;
    },
  });
};

// Create a new Cafe
export const useAddCafe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCafe) => {
      return axios.post(`${API_URL}`, newCafe, {
        headers: {
          'Content-Type': 'multipart/form-data', // Header for file upload
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']); // Invalidate query to refetch cafes
    },
    onError: (error) => {
      console.error('Error creating cafe:', error); // Handle errors
    },
  });
};

// Edit an existing Cafe
export const useEditCafe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedCafe) => {
      return axios.put(`${API_URL}`, updatedCafe, {
        headers: {
          'Content-Type': 'multipart/form-data', // Header for file upload
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']); // Refetch cafes after success
    },
    onError: (error) => {
      console.error('Error updating cafe:', error); // Handle errors
    },
  });
};

// Delete a Cafe
export const useDeleteCafe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cafeDto) => {
      return axios.delete(`${API_URL}`, {
        data: cafeDto, // Send CafeDto object in the request body
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cafes']); // Refetch cafes after deletion
    },
    onError: (error) => {
      console.error('Error deleting cafe:', error); // Handle errors
    },
  });
};
