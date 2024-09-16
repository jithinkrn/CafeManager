import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Use the environment variable REACT_APP_API_URL
const API_URL = process.env.REACT_APP_API_URL_EMPLOYEES;

// Fetch Employees with optional café filtering
export const useGetEmployees = (cafe = '') => {
  return useQuery({
    queryKey: ['employees', cafe],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}?cafe=${cafe}`);
      return data;
    },
  });
};

// Create a new Employee
export const useAddEmployee = () => {
  console.log("I am here at new Employee")  
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEmployee) => {
      return axios.post(`${API_URL}`, newEmployee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
};

// Edit an existing Employee
export const useEditEmployee = () => {
   console.log("I am here at Update Employee") 
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedEmployee) => {
      return axios.put(`${API_URL}`, updatedEmployee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
};

// Delete an Employee
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeDto) => {
      // Send employee data in the request body
      return axios.delete(`${API_URL}`, {
        data: employeeDto,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    },
  });
};
