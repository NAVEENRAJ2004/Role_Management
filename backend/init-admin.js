require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function initAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      // Create admin user
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'ADMIN'
      });

      await admin.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

initAdmin(); 