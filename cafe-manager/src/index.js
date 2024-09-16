import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the app in QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
  
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
