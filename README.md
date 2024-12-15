# Library Management System

## Overview

The Library Management System is a web application designed to manage library operations such as user management, book borrowing, and book return. The system supports different user roles, including **Authors** and **Readers**, each with distinct permissions. The project includes a robust API built with Node.js and Express, integrated with a MongoDB database for persistent storage.



## Features

### User Management
- **Signup**: Users can create accounts as Authors or Readers.
- **Login**: Users can log in to the system and receive a JWT token for session management.
- **Update and Deletion**: Users can update their profile details like name, email, etc as well as delete their account.
- **Roles**: Authors can create books, while Readers can borrow and return books.
- **Validate Session**: Users can validate whether their token is still valid or expired (Validity - 15 days).

### Book Management
- **Add Books**: Authors can add books to the system.
- **Update and Deletion**: Authors can update a book as well as delete them.
- **List Books**: Readers can view all available books or books added by an author.

### Borrowing and Returning
- **Borrow Books**: Readers can borrow books.
- **Return Books**: Readers can return borrowed books.
- **Borrowed Books**: Readers can view their borrowed books.



## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM library for MongoDB.

### Testing
- **Jest**: Testing framework.
- **Supertest**: HTTP assertions and testing.

### Authentication
- **JWT (JSON Web Tokens)**: Token-based authentication.
- **bcrypt**: Password hashing.



## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or hosted instance)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/dark-byte/Library_Management_Backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Library_Management_Backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/library-management
   JWT_SECRET=your-jwt-secret
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. Run tests:
   ```bash
   npm run test
   ```


## API Endpoints

### Authentication Endpoints
| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/users/signup`  | Signup a new user   |
| POST   | `/users/login`   | Login a user        |
| PUT   | `/users/update/:id`   | Updates a user        |
| Delete   | `/users/delete/:id`   | Deletes a user        |
| GET   | `/session/validate`   | Validates a Session        |

### Book Endpoints
| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/books/create`    | Create a new book (Author only) |
| GET    | `/books/list`      | List all books         |
| POST    | `/author/:id`      | List books of author         |
| PUT    | `/update/:id`      | Update a book         |
| Delete    | `/delete/:id`      | Delete a book         |

### Borrow Endpoints
| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| POST   | `/reader/books/borrow`      | Borrow a book (Reader only) |
| GET    | `/reader/books/:id`         | List borrowed books         |
| POST   | `/reader/books/return`      | Return a borrowed book      |


## Project Structure

```plaintext
src
├── config
│   ├── app.ts          # Express app configuration
│   ├── db.ts           # Database connection setup
├── controllers         # API controllers - User, Book, Borrow Controllers
├── models              # Mongoose models - User, Book Model
├── routes              # Express routes - User, Book, Borrow Routes
├── middleware          # Middleware for authentication
├── utils               # Utility functions - Token Management & Validators
└──server.ts            # Main entry point of the application
```


## Testing

To run tests:
```bash
npm run test
```
The tests cover user authentication, book creation, borrowing, and returning functionalities.


## Future Improvements

- Add pagination for book listing.
- Implement email notifications for overdue books.
- Enhance security with rate limiting and IP whitelisting.
- Add an admin panel for managing users and books.



## License

This project is licensed under the MIT License. See the LICENSE file for details.
