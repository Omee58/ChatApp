# Chat App

A real-time chat application built with Node.js, Express, Socket.IO, and MongoDB. This application provides both public and private messaging capabilities with features like typing indicators, user notifications, and message persistence.

## Features

- Real-time messaging using Socket.IO
- Public and private chat functionality
- User presence tracking
- Typing indicators
- Message persistence with MongoDB
- User notifications (join, leave, name changes)
- Active users list
- Chat clearing capability

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Omee58/ChatApp.git
cd ChatApp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Technology Stack

- **Backend:**
  - Node.js
  - Express.js
  - Socket.IO
  - MongoDB with Mongoose

- **Frontend:**
  - HTML/CSS
  - JavaScript
  - Socket.IO Client

## Project Structure

```
Chat App/
├── public/          # Static files and frontend
├── models/          # Database models
├── server.js        # Main application file
├── package.json     # Project dependencies
└── .env            # Environment variables
```

## Features in Detail

### Real-time Communication
- Instant message delivery using Socket.IO
- Support for both public and private messages
- Real-time user presence updates

### User Management
- Dynamic username assignment
- Active users tracking
- User join/leave notifications
- Username change notifications

### Message Features
- Message persistence in MongoDB
- Support for both public and private messages
- Typing indicators
- Chat clearing functionality

## Acknowledgments

- Socket.IO for real-time communication
- Express.js for the web server framework
- MongoDB for data persistence 

---

## written by Omee Balar