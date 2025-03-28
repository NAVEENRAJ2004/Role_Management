require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

const allowedOrigins = [
  'http://localhost:4200', // Local development
  'https://mploychek-assignment-dz20bmv4p-naveenraj2004s-projects.vercel.app/' // Deployed frontend
];

app.use(cors({
  origin: allowedOrigins
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 