import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Real-time socket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Clients can join a 'dashboard' room to receive updates
  socket.on('join_dashboard', () => {
    socket.join('dashboard');
    console.log(`Socket ${socket.id} joined dashboard room`);
  });

  // Listen for simulation data and broadcast it to dashboard
  socket.on('simulate:servers', (data) => {
    io.to('dashboard').emit('dashboard:servers', data);
  });

  socket.on('simulate:power', (data) => {
    io.to('dashboard').emit('dashboard:power', data);
  });

  socket.on('simulate:alert', (data) => {
    io.to('dashboard').emit('dashboard:alert', data);
    // You could also save the alert to DB here
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Pass IO to routes via app.set
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
