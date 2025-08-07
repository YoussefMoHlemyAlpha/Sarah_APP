# SarahApp

A modular Node.js backend application for user authentication, messaging, and user management, built with Express and MongoDB.

---

## Table of Contents

- Features
- Project Structure
- Modules Overview
- Middleware
- Utilities
- Getting Started
- Scripts
- Technologies Used
- Contributing
- License

---

## Features

- **User Authentication:** Register, login, and secure user sessions.
- **User Management:** CRUD operations for user profiles.
- **Messaging:** Send and receive messages between users.
- **Input Validation:** Robust request validation using Joi.
- **Error Handling:** Centralized error management.
- **Email Notifications:** Send emails for events (e.g., registration, password reset).

---

## Project Structure

```
src/
  bootstrap.js                # App initialization
  DB/
    Connection.js             # MongoDB connection setup
    DBServices.js             # Database service utilities
    user.model.js             # User schema/model
  middleware/
    auth.middleware.js        # Authentication middleware
    validation.middleware.js  # Request validation middleware
  modules/
    authModule/
      auth.controller.js      # Auth endpoints
      auth.service.js         # Auth business logic
      auth.validation.js      # Joi schemas for auth
    messageModule/
      message.controller.js   # Messaging endpoints
      message.service.js      # Messaging logic
    userModule/
      user.controller.js      # User endpoints
      user.service.js         # User logic
  utils/
    bcrypt.js                 # Password hashing helpers
    crypto.js                 # Crypto utilities
    Error.js                  # Custom error handler
    sucess.res.js             # Success response helper
    sendEmail/
      emailEvents.js          # Email event triggers
      generateHTML.js         # Email HTML generator
      sendEmail.js            # Email sending logic
index.js                      # Entry point
package.json                  # Project metadata and scripts
```

---

## Modules Overview

### Auth Module (`authModule`)
Handles user registration, login, and authentication logic. Uses Joi for input validation and bcrypt for password hashing.

### User Module (`userModule`)
Manages user data, including profile updates and retrieval. Interacts with the database via Mongoose models.

### Message Module (`messageModule`)
Enables users to send and receive messages. Handles message storage and retrieval.

---

## Middleware

- **auth.middleware.js:** Protects routes by verifying JWT tokens and user roles.
- **validation.middleware.js:** Validates incoming requests using Joi schemas. Returns detailed error messages for invalid data.

---

## Utilities

- **bcrypt.js:** Hashes and compares passwords securely.
- **crypto.js:** Provides cryptographic helpers.
- **Error.js:** Custom error class for consistent error responses.
- **sucess.res.js:** Formats successful API responses.
- **sendEmail/**: Handles email notifications, including event triggers and HTML generation.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a .env file with your MongoDB URI, JWT secret, email credentials, etc.

3. **Run the application:**
   ```bash
   npm start
   ```

---

## Scripts

- `npm start` — Start the server
- `npm run dev` — Start the server in development mode (if configured)

---

## Technologies Used

- Node.js, Express.js
- MongoDB, Mongoose
- Joi (validation)
- bcrypt (password hashing)
- Nodemailer (email sending)

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

---

