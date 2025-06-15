require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let activeUsers = {}; // socketId: name

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected")).catch((err)=> console.log("Error : ", err))

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('setUsername', async (username) => {
    if (!username) return;

    const oldName = activeUsers[socket.id];
    activeUsers[socket.id] = username;

    const messages = await Message.find({ to: null }).sort({ timestamp: 1 });
    socket.emit('loadMessages', messages);

    if (oldName && oldName !== username) {
      io.emit('notify', `${oldName} changed name to ${username}`);
    } else {
      io.emit('notify', `${username} joined the chat`);
    }

    io.emit('activeUsers', Object.values(activeUsers));
  });

  socket.on('chatMessage', async ({ to, message }) => {
    const from = activeUsers[socket.id];
    const newMsg = new Message({ from, to: to || null, message });
    await newMsg.save();

    const msgPayload = { from, to, message };

    if (to) {
      const recipientSocketId = Object.keys(activeUsers).find(key => activeUsers[key] === to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message', msgPayload);
      }
      socket.emit('message', msgPayload);
    } else {
      io.emit('message', msgPayload);
    }
  });

  socket.on('typing', ({ to, typing }) => {
    const from = activeUsers[socket.id];
    if (to) {
      const recipientSocketId = Object.keys(activeUsers).find(key => activeUsers[key] === to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('typing', { from, typing });
      }
    } else {
      socket.broadcast.emit('typing', { from, typing });
    }
  });

  socket.on('clearChat', async () => {
    await Message.deleteMany({});
    io.emit('chatCleared');
  });

  socket.on('disconnect', () => {
    const username = activeUsers[socket.id];
    delete activeUsers[socket.id];
    io.emit('activeUsers', Object.values(activeUsers));
    if (username) {
      io.emit('notify', `${username} left the chat`);
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
