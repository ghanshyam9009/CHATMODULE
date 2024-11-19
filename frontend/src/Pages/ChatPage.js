
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';
import { getUserChats, sendMessage } from '../services/chatService';
import { AuthContext } from '../context/AuthContext';
import '../styles/ChatPage.css';

// Define generateSessionId before using it in the component
const generateSessionId = () =>
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const ChatPage = () => {
    const { assistantId } = useParams();
    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState([]); // Chat history
    const [sessionId, setSessionId] = useState(generateSessionId()); // Active session ID
    const [currentChat, setCurrentChat] = useState([]); // Messages in the current session
    const [error, setError] = useState('');

    // Fetch existing chat history on load
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!user?.id || !user?.tenant?.id) return;

            try {
                const fetchedChats = await getUserChats(assistantId);
                setChats(fetchedChats || []);
                // Automatically set the latest chat as current if available
                const latestChat = fetchedChats?.[fetchedChats.length - 1];
                if (latestChat) {
                    setSessionId(latestChat.sessionId);
                    setCurrentChat(latestChat.messages);
                }
            } catch (err) {
                console.error('Error fetching chat history:', err);
                setError('Failed to load chat history.');
            }
        };
        fetchChatHistory();
    }, [assistantId, user]);

    // End the current chat, save it in history, and start a new chat session
    const endChatSession = () => {
        if (currentChat.length > 0) {
            setChats(prev => {
                const sessionExists = prev.some(chat => chat.sessionId === sessionId);
                if (!sessionExists) {
                    return [
                        ...prev,
                        { sessionId, messages: currentChat }
                    ];
                }
                return prev; // Return existing chats if session exists
            });
        }

        // Start a new chat session
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        setCurrentChat([]);
    };

    const handleSendMessage = async (messageContent) => {
        if (!messageContent.trim()) return;

        try {
            const response = await sendMessage(assistantId, sessionId, messageContent, {
                userId: user.id,
                tenantId: user.tenant.id,
            });

            // Check if the response sessionId is the same as the current sessionId
            if (response.sessionId) {
                setCurrentChat(prev => [
                    ...prev,
                    { role: 'user', content: messageContent },
                    { role: 'assistant', content: response.assistantResponse },
                ]);
                // Update sessionId if a new one is received
                if (response.sessionId !== sessionId) {
                    setSessionId(response.sessionId);
                }
            } else {
                console.error('Session ID mismatch. Expected:', sessionId);
                setError('Session ID mismatch. Please refresh and try again.');
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message.');
        }
    };

    return (
        <div className="chat-page-container">
            <Sidebar
                chats={chats}
                openChatSession={(id) => {
                    const chat = chats.find(c => c.sessionId === id);
                    setSessionId(id);
                    setCurrentChat(chat?.messages || []);
                }}
            />
            <ChatInterface
                sessionId={sessionId}
                chats={currentChat}
                onSendMessage={handleSendMessage}
                onEndChat={endChatSession}
            />
        </div>
    );
};

export default ChatPage;
