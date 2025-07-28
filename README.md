# Node.js Backend with MongoDB Authentication

## Project Overview
This project is a Node.js backend application that provides authentication APIs using MongoDB as the database. It includes user registration and login functionalities, with a user model that consists of username, first name, last name, email, and password.

## Folder Structure
```
node-backend-app
├── src
│   ├── app.js
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   └── authController.js
│   ├── models
│   │   └── user.js
│   ├── routes
│   │   └── authRoutes.js
│   ├── middleware
│   │   └── authMiddleware.js
│   └── utils
│       └── hashPassword.js
├── package.json
├── .env
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-backend-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Run the application**
   ```bash
   npm start
   ```

## API Endpoints

### User Registration
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - Success: 201 Created
  - Error: 400 Bad Request

### User Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - Success: 200 OK with JWT token
  - Error: 401 Unauthorized

## Usage Examples
- To register a new user, send a POST request to `/api/auth/register` with the required fields.
- To log in, send a POST request to `/api/auth/login` with the user's email and password.

## License
This project is licensed under the MIT License.