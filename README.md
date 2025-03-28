# MployChek User Management Application

## Project Overview
A full-stack web application built with Angular 19 and Node.js, featuring user authentication and management.

## Project Structure
- Frontend: Angular 19
- Backend: Express.js
- Database: MongoDB

## Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB

## Installation

### Clone the Repository
```bash
git clone https://github.com/NAVEENRAJ2004/Mpolychek-assignment
cd mploychek
```

### Install Dependencies
```bash
npm install
```

## Available Scripts

### Run Both Frontend and Backend
```bash
npm start
```

### Run Frontend Only
```bash
npm run frontend
```

### Run Backend Only
```bash
npm run backend
```

### Build the Application
```bash
npm run build
```

## Key Dependencies
- Angular Core Packages (v19.2.0)
- Express.js
- MongoDB
- Mongoose
- bcryptjs (Password Hashing)
- jsonwebtoken (Authentication)

## Features
- User Registration
- Role-based Authentication
- Secure Password Hashing
- JWT-based Authorization
- MongoDB Database Integration

## Development Tools
- Angular CLI (v19.2.4)
- TypeScript (v5.7.2)
- Karma (Testing)

## Deployment
Easily deployable on Vercel with built-in configuration.

## Environment Setup
1. Create a `.env` file in the root directory
2. Add the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Testing
Run unit tests:
```bash
npm test
`