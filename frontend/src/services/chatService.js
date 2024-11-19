
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chats'; // Update as needed

// Create Axios instance with base URL and headers
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure token is stored correctly
    },
});

// Get user chats for a specific assistant and session
export const getUserChats = async (assistantId, sessionId) => {
    try {
        const response = await axiosInstance.get(`/user/${assistantId}/${sessionId}`);
        return response.data.chats; // Expecting an array of chat messages
    } catch (error) {
        console.error('Error fetching user chats:', error);
        throw new Error('Failed to fetch user chats');
    }
};

// Send a message to the assistant
export const sendMessage = async (assistantId, sessionId, message, { userId, tenantId }) => {
    if (!userId || !tenantId) {
        console.error('User or tenant information is missing:', { userId, tenantId });
        throw new Error('User or tenant information is missing');
    }

    try {
        const payload = {
            assistantId,
            sessionId,
            tenantId,
            userId,
            messages: [{ role: 'user', content: message }],
        };

        console.log('Sending payload:', payload);

        const response = await axiosInstance.post('/send', payload);

        console.log('sendMessage response data:', response.data);

        return response.data; // Expecting { sessionId, assistantResponse }
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
        throw new Error('Failed to send message');
    }
};

// End a chat session
export const endChatSession = async (assistantId, sessionId) => {
    try {
        const response = await axiosInstance.post('/end', { assistantId, sessionId });
        return response.data;
    } catch (error) {
        console.error('Error ending chat session:', error);
        throw new Error('Failed to end chat session');
    }
};

export default { getUserChats, sendMessage, endChatSession };
