// server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); // MongoDB connection setup
const dotenv = require('dotenv');
const { initGridFS } = require('./config/gridfs'); // Import GridFS initializer

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
connectDB();

// Initialize GridFS after MongoDB connection
initGridFS();

// Sample route to confirm the API is running
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Import routes
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const assistantRoutes = require('./routes/assistantRoutes'); // Assistant management routes
const chatRoutes = require('./routes/chatRoutes'); // Chat-related routes
// const documentRoutes = require('./routes/DocumentRoutes'); // Document upload routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/assistants', assistantRoutes);
app.use('/api/chats', chatRoutes);
// app.use('/api/documents', documentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'An unexpected error occurred.', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
