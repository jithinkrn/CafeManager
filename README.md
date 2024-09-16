
## Background

CafeManager is a full-stack web application designed to help manage cafes and their employees. The application is built using a combination of modern web technologies:

- **Frontend**: A React.js single-page application (SPA) served by Nginx.
- **Backend**: An ASP.NET Core Web API that handles requests and communicates with a MySQL database.
- **Database**: MySQL is used to store cafe and employee information.
- **Containerization**: The entire application is containerized using Docker, allowing seamless development, testing, and deployment across different environments.

## Key Features

- List and manage cafes, including location-based filtering.
- Add, edit, and delete cafes.
- Manage employees working in each cafe.
- A RESTful API for interacting with cafes and employees.

## Technology Stack

- **Frontend**: React.js
- **Backend**: ASP.NET Core 8.0 Web API
- **Database**: MySQL 8.4
- **Containerization**: Docker and Docker Compose

## Prerequisites

Before running the application, ensure that you have the following installed:

- **Docker**: [Get Docker](https://www.docker.com/get-started)
- **Docker Compose**: Comes pre-installed with Docker Desktop

## Project Structure

.

├── CafeManager/               # ASP.NET Core Web API backend
├── cafe-manager/              # React.js frontend
├── docker-compose.yml         # Docker Compose file
├── README.md                  # This file
└── docker-entrypoint-initdb.d/ # MySQL initialization files (if any)

## Running the Application

### 1. Clone the Repository

git clone https://github.com/your-username/cafe-manager.git
cd cafe-manager

### 2. Build and Run the Application Using Docker
Run the following command to build and start the entire application (API, frontend, and MySQL database):

docker-compose up --build

This will:

Build the frontend and backend Docker images.
Set up a MySQL container.
Start the application in separate containers.
The services will start as follows:

Frontend: Accessible at http://localhost:8080
Backend API: Accessible at http://localhost:5000/api/cafes (via Docker internal networking)
MySQL Database: Runs in the background, accessible from the API.

### 3. Access the Application
Frontend: Open your browser and navigate to http://localhost:8080.
API (Backend): You can interact with the API via tools like Postman or curl at http://localhost:5000/api.

### 4. Stopping the Application
To stop the running containers, press CTRL+C in the terminal where Docker Compose is running. Alternatively, you can stop the containers using:

docker-compose down
This command will stop and remove the containers but keep the images intact.

### 5. Additional Commands
Rebuild the Containers: If you make changes to the code or Docker setup, use this command to rebuild:

docker-compose up --build

Check Running Containers:

docker ps


Database Access
The MySQL database is exposed internally via Docker. You can connect to it using the following credentials:

Host: mysql
Port: 3306
Database: cafe_manager
Username: root
Password: password

If you need to interact with the database directly, you can access the MySQL container:

docker exec -it <mysql-container-id> mysql -u root -p
