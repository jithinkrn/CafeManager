import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// const API_URL ='http://localhost:5148/api/cafes';
const API_URL = 'http://localhost:5000/api/cafes';
  

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
