// config/gridfs.js
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

// Initialize GridFS once the MongoDB connection is open
const initGridFS = () => {
    if (gfs) {
        return gfs;
    }

    const conn = mongoose.connection;
    conn.once('open', () => {
        // Initialize GridFS stream
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads'); // Set the collection name to 'uploads'
        console.log('GridFS initialized');
    });
};

// Function to get GridFS instance
const getGFS = () => {
    if (!gfs) {
        throw new Error('GridFS not initialized');
    }
    return gfs;
};

module.exports = { initGridFS, getGFS };
