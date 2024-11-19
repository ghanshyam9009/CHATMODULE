
// src/components/Sidebar.js
// import React from 'react';
// import '../styles/Sidebar.css';

// const Sidebar = ({ chats, openChatSession }) => {
//     return (
//         <div className="sidebar-container">
//             <h2>Chat History</h2>
//             <ul>
//                 {chats.map((chat) => (
//                     <li
//                         key={chat.sessionId}
//                         onClick={() => openChatSession(chat.sessionId)}
//                     >
//                         {`Session: ${chat.sessionId}`}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default Sidebar;



// src/components/Sidebar.js
import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ chats, openChatSession }) => {
    const getLastMessagePreview = (messages) => {
        if (!messages || messages.length === 0) return "No messages yet";
        const lastMessage = messages[messages.length - 1].content;
        return lastMessage.length > 10 
            ? `${lastMessage.substring(0,30)}...` 
            : lastMessage;
    };

    return (
        <div className="sidebar-container">
            <h2>Chat History</h2>
            <ul className="chat-list">
                {chats.map((chat) => (
                    <li
                        key={chat.sessionId}
                        className="chat-preview"
                        onClick={() => openChatSession(chat.sessionId)}
                    >
                        {getLastMessagePreview(chat.messages)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
