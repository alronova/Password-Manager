# Password Manager

## Overview

The Password Manager project is a secure and efficient platform designed to help users manage their passwords across multiple websites. It ensures robust security by implementing user authentication through JWT tokens and storing passwords using AES encryption.

## Features

- **User Authentication**: Sign up and log in using credentials. Passwords are hashed using `bcryptjs` for secure storage.
- **JWT Token**: Issued upon successful login for session management.
- **Secure Password Storage**: Passwords are encrypted using AES before being stored in the database.
- **User-Friendly Dashboard**: Manage credentials with a clean and intuitive interface.
- **Credential Management**: View, edit, decrypt, and delete credentials with ease.
- **Data Protection**: No plain text passwords are stored, ensuring data integrity.

## Setup Instructions

### 1. Clone the Repository:

```bash
    git clone <repository-url>
    cd password-manager
```

### 2. Install Dependencies

- For the server:
  ```bash
  cd Server
  npm install
  ```
- For the client:
  ```bash
    cd ..
    npm install
  ```

### 3. Environment Variables

- Create .env file in the server directory
  ```bash
    MONGO_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    SECRET_KEY=<your-encryption-key>
    PORT=8080
  ```
### 4. Run the Application
   ```bash
    cd Server
    npm start
```

### 5. Make sure to change the variables accordingly...
   ```bash
    cd Server
    npm start
```