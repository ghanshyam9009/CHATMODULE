
const ChatMessage = require('../models/ChatMessage'); // Correct model import
const Assistant = require('../models/Assistant');
const OpenAI = require('openai'); // Correct import

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// exports.sendMessage = async (req, res) => {
//     const { tenantId, userId, assistantId, messages } = req.body;

//     try {
//         // Check if an active session exists
//         const existingChat = await ChatMessage.findOne({
//             tenantId,
//             userId,
//             assistantId,
//             isActive: true,
//         });

//         // Generate or use existing session ID
//         const currentSessionId = existingChat ? existingChat.sessionId : generateUniqueSessionId();

//         // Create or update chat message
//         let chatMessage;
//         if (existingChat) {
//             chatMessage = existingChat;
//             chatMessage.messages.push(...messages);
//         } else {
//             chatMessage = new ChatMessage({
//                 tenantId,
//                 userId,
//                 assistantId,
//                 sessionId: currentSessionId,
//                 messages: messages,
//             });
//         }

//         await chatMessage.save();

//         // Get the user's last message
//         const userMessage = messages[messages.length - 1].content;

//         // Fetch assistant's instructions
//         const assistant = await Assistant.findById(assistantId);
//         const assistantInstructions = assistant ? assistant.instructions : 'You are a helpful assistant.';

//         // Call OpenAI API for assistant's response
//         const openAIResponse = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 { role: 'system', content: assistantInstructions },
//                 { role: 'user', content: userMessage }
//             ]
//         });

//         const assistantResponse = openAIResponse.choices[0].message.content;

//         // Append assistant's response
//         chatMessage.messages.push({
//             role: 'assistant',
//             content: assistantResponse,
//         });

//         await chatMessage.save();

//         res.status(201).json({
//             message: 'Message sent successfully.',
//             sessionId: currentSessionId,
//             assistantResponse: assistantResponse,
//         });
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).json({ message: 'Error sending message.', error: error.message });
//     }
// };






// Fetch all chats for a user, including inactive sessions



exports.sendMessage = async (req, res) => {
    const { tenantId, userId, assistantId, sessionId, messages } = req.body; // Include sessionId from payload

    try {
        // Check if an active session exists with the given sessionId
        const existingChat = await ChatMessage.findOne({
            tenantId,
            userId,
            assistantId,
            sessionId, // Use the sessionId from the payload
        });

        // Create or update chat message
        let chatMessage;
        if (existingChat) {
            // If the chat exists, update it
            chatMessage = existingChat;
            chatMessage.messages.push(...messages); // Add new messages to the existing session
        } else {
            // Create a new chat message with the sessionId from the payload
            chatMessage = new ChatMessage({
                tenantId,
                userId,
                assistantId,
                sessionId, // Use the sessionId from the payload
                messages: messages, // Initialize with the provided messages
            });
        }

        await chatMessage.save(); // Save the chat message

        // Get the user's last message
        const userMessage = messages[messages.length - 1].content;

        // Fetch assistant's instructions
        const assistant = await Assistant.findById(assistantId);
        const assistantInstructions = assistant ? assistant.instructions : 'You are a helpful assistant.';

        // Call OpenAI API for assistant's response
        const openAIResponse = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: assistantInstructions },
                { role: 'user', content: userMessage }
            ]
        });

        const assistantResponse = openAIResponse.choices[0].message.content;

        // Append assistant's response to the chat message
        chatMessage.messages.push({
            role: 'assistant',
            content: assistantResponse,
            timestamp: new Date().toISOString(),
        });

        await chatMessage.save(); // Save the updated chat message with assistant's response

        res.status(201).json({
            message: 'Message sent successfully.',
            sessionId: sessionId, // Return the session ID from the payload
            assistantResponse: assistantResponse,
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Error sending message.', error: error.message });
    }
};





exports.getUserChats = async (req, res) => {
    const { assistantId } = req.params;
    const userId = req.user.id;
    const tenantId = req.user.tenantId;

    try {
        // Verify assistant ownership
        const assistant = await Assistant.findById(assistantId);
        if (!assistant || assistant.tenantId.toString() !== tenantId || assistant.userId.toString() !== userId) {
            return res.status(404).json({ message: 'Assistant not found or does not belong to you.' });
        }

        // Fetch chats for the assistant, regardless of active status
        const chats = await ChatMessage.find({
            assistantId: assistantId,
            userId: userId,
            tenantId: tenantId,
        });

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this assistant.' });
        }

        res.status(200).json({
            message: 'Chats retrieved successfully.',
            chats: chats.map(chat => ({
                sessionId: chat.sessionId,
                messages: chat.messages,
                isActive: chat.isActive,
                createdAt: chat.createdAt,
            })), // Return messages and session info
        });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Error fetching chats.', error: error.message });
    }
};

exports.getAssistantChats = async (req, res) => {
    const { assistantId } = req.params;
    const tenantId = req.user.tenantId;

    try {
        // Verify assistant ownership
        const assistant = await Assistant.findById(assistantId);
        if (!assistant || assistant.tenantId.toString() !== tenantId) {
            return res.status(404).json({ message: 'Assistant not found or does not belong to this tenant.' });
        }

        // Fetch chats for the assistant, regardless of active status
        const chats = await ChatMessage.find({
            assistantId: assistantId,
            tenantId: tenantId,
        });

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this assistant.' });
        }

        res.status(200).json({
            message: 'Chats retrieved successfully.',
            chats: chats.map(chat => ({
                sessionId: chat.sessionId,
                messages: chat.messages,
                isActive: chat.isActive,
                createdAt: chat.createdAt,
            })), // Return messages and session info
        });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Error fetching chats.', error: error.message });
    }
};

exports.endChatSession = async (req, res) => {
    const { assistantId, sessionId } = req.body;
    const userId = req.user.id;
    const tenantId = req.user.tenantId;

    if (!assistantId || !sessionId) {
        return res.status(400).json({ message: 'Assistant ID and session ID are required.' });
    }

    try {
        // Find the chat session
        const chat = await ChatMessage.findOne({
            assistantId: assistantId,
            sessionId: sessionId,
            tenantId: tenantId,
            userId: userId
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat session not found.' });
        }

        // Mark the session as ended
        chat.isActive = false;
        await chat.save();

        res.status(200).json({ message: 'Chat session ended successfully.' });
    } catch (error) {
        console.error('Error ending chat session:', error);
        res.status(500).json({ message: 'Error ending chat session.', error: error.message });
    }
};

// Helper function remains the same
function generateUniqueSessionId() {
    return 'session_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
}
