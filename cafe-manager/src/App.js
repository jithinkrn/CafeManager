import React from 'react';
import { RouterProvider, createRouter, RootRoute, Route,Outlet  } from '@tanstack/react-router';
import Cafes from './pages/Cafes';
import AddEditCafe from './pages/AddEditCafe';
import Employees from './pages/Employees';
import AddEditEmployee from './pages/AddEditEmployee';
import Navbar from './components/Navbar'; 
import './assets/styles.css';

// Define the root route
// const rootRoute = new RootRoute({
//   component: Cafes, // Set default page component for root
// });

const rootRoute = new RootRoute({
  component: () => (
    <div>
      <Navbar />  {/* Keep Navbar here to make it available across all pages */}
      <Outlet />  {/* This is where the routes will be rendered */}
    </div>
  ),
});

const defaultCafesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',  // Default route for displaying the Cafes page
  component: Cafes,
});

// Define child routes
const cafesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'cafes',
  component: Cafes,
});

const addCafeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'add-cafe',
  component: AddEditCafe,
});

const editCafeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'edit-cafe',
  component: AddEditCafe,
});

const employeesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'employees',
  component: Employees,
});

const addEmployeeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'add-employee',
  component: AddEditEmployee,
});

const editEmployeeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'edit-employee',
  component: AddEditEmployee,
});

// Create the router
const router = createRouter({
  routeTree: rootRoute.addChildren([
    cafesRoute,
    addCafeRoute,
    editCafeRoute,
    employeesRoute,
    addEmployeeRoute,
    editEmployeeRoute,
    defaultCafesRoute
  ]),
});

// const App = () => (
//   <RouterProvider router={router}>

//   {/* <rootRoute.component /> */}
// </RouterProvider>

// );

const App = () => (
  <RouterProvider router={router}>
    {/* The RouterProvider automatically renders the current route */}
  </RouterProvider>
);

export default App;
