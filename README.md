### Ticket Management Platform

This README aims to provide a detailed overview of the ticket management platform, which allows users to create, edit, view tickets, and manage user data. The project consists of two main parts: the backend API (implemented with Node.js and Sequelize) and the frontend (implemented with React and Vite).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development Scripts](#development-scripts)
- [Database Configuration](#database-configuration)
- [Tests](#tests)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project is a ticket management platform that allows users to:

- **Create Tickets**: Create new tickets with detailed information such as title, description, observations, creator, updator, state, and department.
- **Edit Tickets**: Edit the details of an existing ticket. **Only administrators** have the permissions to edit tickets.
- **View Tickets**: View a list of tickets and the details of a specific ticket.
- **Manage User Data**: Manage user profile data, including changes to name, password and department.

The backend of the application is built with **Node.js** using **Sequelize** for database management with PostgreSQL. The frontend is built with **React** using **Vite** as the build tool.

---

## Features

### Backend
- **User Authentication** with **JWT**.
- **Ticket Management**:
  - **Creation** of tickets.
  - **Editing** of tickets (only by administrators).
  - **Viewing** of tickets.
- **User Data Management**:
  - Edit user profile.
  - Password updates.
  - Input validation using **Yup**.
- **Ticket Validation**:
  - Automatic validation upon ticket creation and editing.
  - `Rejected` status requires observations to be provided.

### Frontend
- **User Interface** for managing tickets.
- **Forms** for creating and viewing tickets.
- **Pagination and filters** to make ticket navigation easier.
- **Notifications** for feedback to the user after creating tickets.
- **Integration with Backend API** for data persistence and ticket manipulation.

---

## Prerequisites

### Backend
- Node.js (version 16.x or higher)
- PostgreSQL
- Yarn (Package Manager)

### Frontend
- Node.js (version 16.x or higher)
- Yarn
- PostgreSQL
- Vite (version 6.x or higher)

---

## Installation

### Backend

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sergioscker/api.git
   cd api
   ```

2. **Install Dependencies**:
   ```bash
   yarn install
   ```

3. **Create an `.env` file based on the `.env.example` and configure environment variables**:
   ```dotenv
   PORT=3000
   DATABASE_URL=postgres://username:password@localhost:5432/database_name
   SECRET_KEY=your_secret_key
   ```

4. **Run Database Migrations**:
   ```bash
   yarn sequelize-cli db:migrate
   ```

5. **Start the Server**:
   ```bash
   yarn dev
   ```

### Frontend

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sergioscker/ticket-managment.git
   cd ticket-management
   ```

2. **Install Dependencies**:
   ```bash
   yarn install
   ```

3. **Start Development Server with Vite**:
   ```bash
   yarn dev
   ```

4. **Access the application in the browser**: [http://localhost:5173](http://localhost:5173)

---

## Usage

### Backend

1. **Creating Tickets**:
   - Use the `POST /tickets` endpoint to provide necessary details and a new ticket will be created.
   - Example request:
     ```http
     POST /tickets
     Content-Type: application/json

     {
       "title": "Sample Ticket",
       "description": "This is a sample ticket description",
       "observations": "Initial observations",
       "createdBy": "user_id",
       "updatedBy": "user_id",
       "id_state": "state_id",
       "id_department": "department_id"
     }
     ```

2. **Editing Tickets**:
   - To edit an existing ticket, send a `PUT /tickets/:id` request with the modified details.
   - **Only administrators** have the permission to edit tickets.

3. **Viewing Tickets**:
   - Use the `GET /tickets` endpoint to list all tickets or filter them by state, department, and other parameters.

### Frontend

1. **Creating Tickets**:
   - Through the user interface, click on `New Ticket`, fill out the required fields, and submit the form.

2. **Editing Tickets**:
   - To edit an existing ticket, select it from the list, modify the fields as needed, and save the changes.

3. **Viewing Tickets**:
   - Navigate to the ticket list to view all existing tickets for the department, and click on a specific ticket to see the details.

4. **Managing User Data**:
   - Through the profile page, you can edit your name, password and department.

---

## API Endpoints

### Tickets
- **`POST /tickets`**: Create a new ticket.
- **`PUT /tickets/:id`**: Edit an existing ticket (only by administrators).
- **`GET /tickets`**: List all tickets.
- **`GET /tickets/:id`**: View details of a specific ticket.

### Users
- **`POST /users`**: Register a new user.
- **`POST /session`**: Log in.
- **`PUT /users`**: Edit user data.
- **`GET /users/:id`**: View user profile.

### Authentication
- **`POST /session`**: Authenticate a user and return a JWT token.
- **`POST /session`**: Refresh an expired JWT token.

---

## Development Scripts

### Backend
- **`yarn dev`**: Start development server with Nodemon.
- **`yarn sequelize-cli db:migrate`**: Run database migrations.

### Frontend
- **`yarn dev`**: Start development server with Vite.
- **`yarn build`**: Build the production version of the application.
- **`yarn preview`**: Start preview server to test the production version locally.

---

## Database Configuration

1. Ensure PostgreSQL is installed and running.
2. Configure environment variables as per the `.env.example` files in both `backend` and `frontend`.
3. Run database migrations using the command `yarn sequelize-cli db:migrate`.

---

## Tests

### Backend
- Use `jest` for unit tests and `supertest` for integration tests.
- Run tests with `yarn test` or separately with `yarn test:unit` and `yarn test:integration`.

### Frontend
- Use `eslint` for linting.
- Run lint tests with `yarn lint`.

---

## Contributing

If you wish to contribute to the project, follow standard pull request practices on GitHub. Ensure that any significant changes are documented in the README or tests.

---

## License

This project is licensed under the ISC License. Please refer to the `LICENSE` file for more details.

---
