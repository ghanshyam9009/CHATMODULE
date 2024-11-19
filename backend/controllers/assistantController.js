const Assistant = require('../models/Assistant');
const OpenAI = require('openai'); // Import OpenAI SDK

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Use your OpenAI API key

// Create Assistant
exports.createAssistant = async (req, res) => {
    const { name, instructions, model } = req.body; // Extract name, instructions, and model from request body
    const tenantId = req.user.tenantId; // Get tenantId from the authenticated user
    const userId = req.user.id; // Get userId from the authenticated user

    // Check if the user is an admin
    if (req.user.role === 'admin') {
        return res.status(403).json({ message: 'Admin users are not allowed to create assistants.' });
    }

    if (!name || !instructions) {
        return res.status(400).json({ message: 'Name and instructions are required.' });
    }

    try {
        // Step 1: Create assistant via OpenAI API
        const openAIResponse = await openai.beta.assistants.create({
            instructions: instructions,
            name: name,
            model: model || 'gpt-3.5-turbo', // Default to GPT-4 if no model is provided
            tools: [], // Add any tools if required, like a code interpreter
        });

        const { id: openAIId, tools } = openAIResponse; // Extract OpenAI assistant ID and tools

        // Step 2: Create assistant in MongoDB
        const assistant = new Assistant({
            tenantId,
            userId,
            name,
            model: model || 'gpt-3.5-turbo',
            openAIId: openAIId, // Store OpenAI assistant ID
            instructions: instructions, // Store the instructions
            tools: tools.map(tool => tool.type), // Store tool types, if any
        });

        await assistant.save();

        res.status(201).json({
            message: 'Assistant created successfully.',
            assistant: {
                id: assistant._id,
                name: assistant.name,
                model: assistant.model,
                openAIId: assistant.openAIId,
                instructions: assistant.instructions,
                createdAt: assistant.createdAt,
            },
        });
    } catch (error) {
        console.error('Error creating assistant:', error);
        res.status(500).json({ message: 'Error creating assistant.', error: error.message });
    }
};



exports.getUserAssistants = async (req, res) => {
    const userId = req.user.id; // Extract user ID from the authenticated request
    const tenantId = req.user.tenantId; // Extract tenant ID from the authenticated request

    try {
        // Find assistants that belong to the tenant and match the user ID (if applicable)
        const assistants = await Assistant.find({ tenantId, userId });

        // Check if any assistants are found
        if (!assistants || assistants.length === 0) {
            return res.status(404).json({ message: 'No assistants found for this user.' });
        }

        // Send the list of assistants in the response
        res.status(200).json({
            message: 'Assistants fetched successfully.',
            assistants,
        });
    } catch (error) {
        console.error('Error fetching assistants:', error);
        res.status(500).json({ message: 'Error fetching assistants.', error: error.message });
    }
};

exports.getUserAssistantsForAdmin = async (req, res) => {
    const { userId } = req.params; // Extract the user ID from the route parameters
    const tenantId = req.user.tenantId; // Extract tenant ID from the authenticated request

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Find assistants that belong to the tenant and match the user ID
        const assistants = await Assistant.find({ tenantId, userId });

        // Check if any assistants are found
        if (!assistants || assistants.length === 0) {
            return res.status(404).json({ message: 'No assistants found for this user.' });
        }

        // Send the list of assistants in the response
        res.status(200).json({
            message: 'Assistants fetched successfully.',
            assistants,
        });
    } catch (error) {
        console.error('Error fetching assistants for admin:', error);
        res.status(500).json({ message: 'Error fetching assistants.', error: error.message });
    }
};