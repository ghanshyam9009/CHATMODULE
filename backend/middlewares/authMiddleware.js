// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1]; // Extract the token from Authorization header

//     if (!token) {
//         return res.status(401).json({ message: 'Authorization token is required.' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid token.' });
//         }
//         req.user = decoded; // Attach decoded token info to the request
//         next(); // Proceed to the next middleware or route
//     });
// };

// module.exports = authMiddleware;


// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = {
            id: decoded.id,
            tenantId: decoded.tenantId,
            username: decoded.username, // Any other user info
        };
        next();
    });
};

module.exports = authMiddleware;
