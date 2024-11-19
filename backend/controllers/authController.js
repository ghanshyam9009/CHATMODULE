const User = require('../models/User');
const Tenant = require('../models/Tenant');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

// User Registration with Tenant Association
// User Registration with Tenant Association
exports.register = async (req, res) => {
    const { username, password, tenantName, role } = req.body;

    console.log('Received registration data:', req.body);

    if (!username || !password || !tenantName) {
        return res.status(400).json({ message: 'Username, password, and tenant name are required.' });
    }

    try {
        const normalizedTenantName = tenantName.toLowerCase();
        let tenant = await Tenant.findOne({ name: normalizedTenantName });

        if (!tenant) {
            tenant = new Tenant({ name: normalizedTenantName });
            console.log('Attempting to save tenant:', tenant);

            try {
                await tenant.save();
                console.log(`Created new tenant: ${tenantName}`);
            } catch (error) {
                console.error('Error saving tenant:', error);
                return res.status(500).json({ message: 'Error creating tenant.', error: error.message });
            }
        } else {
            console.log(`Found existing tenant: ${tenantName}`);
        }

        // Normalize username to lowercase
        const lowercasedUsername = username.toLowerCase();
        console.log('Checking for existing user with username:', lowercasedUsername);

        const existingUser = await User.findOne({ username: lowercasedUsername, tenantId: tenant._id });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists for this tenant.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: lowercasedUsername,
            password: hashedPassword,
            role,
            tenantId: tenant._id,
        });

        await user.save();
        res.status(201).json({
            message: 'User registered successfully and associated with tenant.',
            tenantId: tenant._id,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error registering user and associating with tenant.', error: error.message });
    }
};



// User Login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Fetch the associated tenant
        const tenant = await Tenant.findById(user.tenantId);

        const token = jwt.sign({ id: user._id, tenantId: user.tenantId }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                tenant: {
                    id: tenant._id,
                    name: tenant.name,
                    createdAt: tenant.createdAt, // Include created date if needed
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
};

// Logout - simply acknowledges the logout
exports.logout = (req, res) => {
    res.status(200).json({ message: 'User logged out successfully.' });
};

exports.getUsersByTenant = async (req, res) => {
    try {
        const { tenantId } = req.params; // Extract tenantId from the URL parameters

        // Check if tenantId is provided
        if (!tenantId) {
            return res.status(400).json({ message: 'Tenant ID is required.' });
        }

        // Find all users belonging to the specified tenant
        const users = await User.find({ tenantId }).select('-password'); // Exclude password from the results

        // If no users found, return a message
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found for this tenant.' });
        }

        res.status(200).json({
            message: 'Users retrieved successfully.',
            users,
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users.', error: error.message });
    }
};