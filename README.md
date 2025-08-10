# SarahApp

A robust, modular Node.js backend for authentication, messaging, and user management, built with Express, MongoDB, and advanced security features.

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
- API Highlights
- Security Features
- Contributing
- License

---

## Features

- **User Authentication:** Register, login (email/password & Google OAuth2), and secure sessions.
- **User Management:** CRUD for profiles, password updates, and email changes with dual OTP confirmation.
- **Messaging:** Send and receive messages between users.
- **Input Validation:** Joi-based request validation.
- **Error Handling:** Centralized error management.
- **Email Notifications:** Registration, password reset, and email update events.
- **OTP Security:** Email/password changes require OTP, with ban logic for repeated failures.
- **Social Login:** Google OAuth2 login support.
- **Password History:** Prevents reuse of old passwords.

---

## Project Structure

```
src/
  bootstrap.js
  DB/
    Connection.js
    DBServices.js
    user.model.js
  middleware/
    auth.middleware.js
    validation.middleware.js
  modules/
    authModule/
      auth.controller.js
      auth.service.js
      auth.validation.js
    messageModule/
      message.controller.js
      message.service.js
    userModule/
      user.controller.js
      user.service.js
  utils/
    bcrypt.js
    crypto.js
    Error.js
    sucess.res.js
    sendEmail/
      emailEvents.js
      generateHTML.js
      sendEmail.js
index.js
package.json
```

---

## Modules Overview

### Auth Module (`authModule`)
- Email/password and Google OAuth2 login
- Email confirmation with OTP and ban logic
- Password reset/change with OTP and expiry
- Email update with dual OTP confirmation (old and new email)
- Token refresh (access/refresh tokens)
- Resend OTP for email/password/email update
- Password history enforcement

### User Module (`userModule`)
Manages user data, profile updates, and retrieval.

### Message Module (`messageModule`)
Handles user-to-user messaging.

---

## Middleware

- **auth.middleware.js:** JWT token and role verification.
- **validation.middleware.js:** Joi-based request validation.

---

## Utilities

- **bcrypt.js:** Password hashing and comparison.
- **crypto.js:** Cryptographic helpers.
- **Error.js:** Custom error class.
- **sucess.res.js:** Success response formatting.
- **sendEmail/**: Email notifications, event triggers, and HTML generation.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a .env file with MongoDB URI, JWT secrets, Google OAuth audience, email credentials, etc.

3. **Run the application:**
   ```bash
   npm start
   ```

---

## Scripts

- `npm start` — Start the server
- `npm run dev` — Start in development mode (if configured)

---

## Technologies Used

- Node.js, Express.js
- MongoDB, Mongoose
- Joi (validation)
- bcrypt (password hashing)
- Nodemailer (email sending)
- Google Auth Library (OAuth2)

---

## API Highlights

- **Login:** System and Google login.
- **Email Confirmation:** OTP-based, with ban after multiple failed attempts.
- **Password Reset:** OTP sent to email, with expiry and ban logic.
- **Email Update:** Dual OTP confirmation for old and new emails.
- **Token Refresh:** Secure refresh token endpoint.
- **Resend OTP:** For email/password/email update.
- **Password History:** Prevents reuse of previous passwords.

---

## Security Features

- OTP expiry and ban logic for brute-force prevention.
- Password history tracking to prevent reuse.
- Dual OTP for email change (old and new email confirmation).
- JWT-based authentication and refresh tokens.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

---

## License

MIT

---
