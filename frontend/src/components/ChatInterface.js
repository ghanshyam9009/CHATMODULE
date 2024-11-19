

// // src/components/ChatInterface.js
// import React, { useState } from 'react';
// import '../styles/ChatInterface.css';

// const ChatInterface = ({ assistantId, sessionId, chats, onSendMessage }) => {
//     const [messageContent, setMessageContent] = useState('');

//     const handleSend = () => {
//         if (messageContent.trim()) {
//             onSendMessage(messageContent);
//             setMessageContent('');
//         }
//     };

//     return (
//         <div className="chat-interface-container">
//             <div className="chat-history">
//                 {chats.length === 0 ? (
//                     <p>No messages yet...</p>
//                 ) : (
//                     chats.map((message, index) => (
//                         <div key={index} className={`chat-message ${message.role}`}>
//                             <p>{message.content}</p>
//                         </div>
//                     ))
//                 )}
//             </div>
//             <div className="chat-input-container">
//                 <input
//                     type="text"
//                     value={messageContent}
//                     onChange={(e) => setMessageContent(e.target.value)}
//                     placeholder="Type your message..."
//                 />
//                 <button onClick={handleSend}>Send</button>
//             </div>
//         </div>
//     );
// };





// // src/pages/ChatPage.js
// import React, { useEffect, useState, useContext } from 'react';
// import { useParams } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';
// import ChatInterface from '../components/ChatInterface';
// import { getUserChats, sendMessage } from '../services/chatService';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/ChatPage.css';

// const ChatPage = () => {
//     const { assistantId } = useParams();
//     const { user } = useContext(AuthContext);
//     const [chats, setChats] = useState([]); // Chat history
//     const [sessionId, setSessionId] = useState(null); // Active session
//     const [currentChat, setCurrentChat] = useState([]); // Messages in the current session
//     const [error, setError] = useState('');

//     // Fetch existing chat history on load
//     useEffect(() => {
//         const fetchChatHistory = async () => {
//             if (!user?.id || !user?.tenant?.id) return;

//             try {
//                 const fetchedChats = await getUserChats(assistantId);
//                 setChats(fetchedChats || []);
//             } catch (err) {
//                 console.error('Error fetching chat history:', err);
//                 setError('Failed to load chat history.');
//             }
//         };
//         fetchChatHistory();
//     }, [assistantId, user]);

//     // Start a new chat session
//     const startNewChat = () => {
//         setSessionId(generateSessionId());
//         setCurrentChat([]); // Reset messages for new session
//     };

//     const generateSessionId = () =>
//         `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

//     // End the current chat and store it in history
//     const endChatSession = () => {
//         if (currentChat.length > 0) {
//             setChats(prev => [...prev, { sessionId, messages: currentChat }]);
//         }
//         startNewChat(); // Start a new session after ending
//     };

//     const handleSendMessage = async (messageContent) => {
//         if (!messageContent.trim()) return;

//         try {
//             const response = await sendMessage(assistantId, sessionId, messageContent, {
//                 userId: user.id,
//                 tenantId: user.tenant.id,
//             });

//             setCurrentChat(prev => [
//                 ...prev,
//                 { role: 'user', content: messageContent },
//                 { role: 'assistant', content: response.assistantResponse },
//             ]);
//         } catch (err) {
//             console.error('Error sending message:', err);
//             setError('Failed to send message.');
//         }
//     };

//     return (
//         <div className="chat-page-container">
//             <Sidebar
//                 chats={chats}
//                 openChatSession={(id) => {
//                     const chat = chats.find(c => c.sessionId === id);
//                     setSessionId(id);
//                     setCurrentChat(chat?.messages || []);
//                 }}
//             />
//             <ChatInterface
//                 sessionId={sessionId}
//                 chats={currentChat}
//                 onSendMessage={handleSendMessage}
//                 onEndChat={endChatSession}
//             />
//         </div>
//     );
// };

// export default ChatPage;





// // src/components/ChatInterface.js
// import React, { useState } from 'react';
// import '../styles/ChatInterface.css';

// const ChatInterface = ({ sessionId, chats, onSendMessage, onEndChat }) => {
//     const [message, setMessage] = useState('');

//     const handleSend = () => {
//         onSendMessage(message);
//         setMessage(''); // Clear input after sending
//     };

//     return (
//         <div className="chat-interface-container">
//             <div className="messages-container">
//                 {chats.map((chat, index) => (
//                     <div key={index} className={`message ${chat.role}`}>
//                         {chat.content}
//                     </div>
//                 ))}
//             </div>
//             <div className="input-container">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="Type a message..."
//                 />
//                 <button onClick={handleSend}>Send</button>
//                 <button onClick={onEndChat}>End Chat</button>
//             </div>
//         </div>
//     );
// };

// export default ChatInterface;



// src/components/ChatInterface.js
import React, { useState } from 'react';
import '../styles/ChatInterface.css';

const ChatInterface = ({ sessionId, chats, onSendMessage, onEndChat }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        onSendMessage(message);
        setMessage(''); // Clear input after sending
    };

    return (
        <div className="chat-interface-container">
            <div className="messages-container">
                {chats.map((chat, index) => (
                    <div key={index} className={`message ${chat.role}`}>
                        {chat.content}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend}>Send</button>
                <button onClick={onEndChat}>End Chat</button>
            </div>
        </div>
    );
};

export default ChatInterface;
