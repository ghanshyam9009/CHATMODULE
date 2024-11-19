import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar'; // Admin sidebar component
import AdminChatInterface from '../components/AdminChatInterface'; // Admin chat interface component
import { fetchAdminChats } from '../services/chatService'; // Updated service function
import { AuthContext } from '../context/AuthContext';
// import '../styles/ChatPage.css';

const AdminChatPage = () => {
    const { assistantId } = useParams(); // Get assistant ID from URL
    const { user } = useContext(AuthContext); // Get user context
    const [chats, setChats] = useState([]); // Chat history
    const [sessionId, setSessionId] = useState(null); // Active session ID
    const [currentChat, setCurrentChat] = useState([]); // Messages in the current session
    const [error, setError] = useState(''); // Error message

    // Fetch existing chat history on load
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const fetchedChats = await fetchAdminChats(assistantId); // Fetch chats for admin
                setChats(fetchedChats || []); // Set fetched chats

                // Automatically set the latest chat as current if available
                const latestChat = fetchedChats?.[fetchedChats.length - 1];
                if (latestChat) {
                    setSessionId(latestChat.sessionId);
                    setCurrentChat(latestChat.messages);
                }
            } catch (err) {
                console.error('Error fetching chat history:', err);
                setError('Failed to load chat history.'); // Set error if fetching fails
            }
        };
        fetchChatHistory();
    }, [assistantId]);

    // Function to handle chat session selection
    const openChatSession = (id) => {
        const chat = chats.find(c => c.sessionId === id);
        setSessionId(id);
        setCurrentChat(chat?.messages || []); // Set current chat messages
    };

    return (
        <div className="chat-page-container">
            <AdminSidebar 
                chats={chats} 
                openChatSession={openChatSession} // Pass function to open selected chat
            />
            <AdminChatInterface
                sessionId={sessionId}
                chats={currentChat}
                // Add additional props if needed for sending messages
            />
            {error && <div className="error-message">{error}</div>} {/* Display error if any */}
        </div>
    );
};

export default AdminChatPage;
