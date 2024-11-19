
// // UserAssistants.js
// import React, { useState } from 'react';
// import '../styles/UserAssistants.css'; // Import your styles

// const UserAssistants = ({ assistants, user }) => {
//     const [searchTerm, setSearchTerm] = useState('');
    
//     // Filter assistants based on the search term
//     const filteredAssistants = assistants.filter(assistant =>
//         assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="user-assistants-container">
//             <h2>Assistants for {user.username}:</h2>
//             <input
//                 type="text"
//                 placeholder="Search assistants..."
//                 className="search-bar"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
//             />
//             <ul className="assistants-list">
//                 {filteredAssistants.length > 0 ? (
//                     filteredAssistants.map(assistant => (
//                         <li key={assistant._id}>
//                             <span>{assistant.name}</span>
//                             <span> Created At: {new Date(assistant.createdAt).toLocaleString()}</span> {/* Display creation date */}
//                         </li>
//                     ))
//                 ) : (
//                     <p className="no-assistants">No assistants found for this user.</p>
//                 )}
//             </ul>
//         </div>
//     );
// };

// export default UserAssistants;
// UserAssistants.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation
import '../styles/UserAssistants.css'; // Import your styles
import { fetchAssistantChats } from '../services/adminServices'; // Import the service

const UserAssistants = ({ assistants, user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Initialize navigate for navigation
    
    // Filter assistants based on the search term
    const filteredAssistants = assistants.filter(assistant =>
        assistant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssistantClick = async (assistant) => {
        try {
            // Example sessionId, replace this with your actual logic to get the session ID
            const sessionId = 'session_1728588928435_u2me37xz5'; 
            const chats = await fetchAssistantChats(assistant._id, sessionId);
            // Navigate to chat history page with the assistant ID and session ID
            navigate(`/assistant/${assistant._id}/chat-history`);
        } catch (error) {
            console.error('Error fetching assistant chats:', error);
        }
    };

    return (
        <div className="user-assistants-container">
            <h2>Assistants for {user.username}:</h2>
            <input
                type="text"
                placeholder="Search assistants..."
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            />
            <ul className="assistants-list">
                {filteredAssistants.length > 0 ? (
                    filteredAssistants.map(assistant => (
                        <li key={assistant._id} onClick={() => handleAssistantClick(assistant)} style={{ cursor: 'pointer' }}>
                            <span>{assistant.name}</span>
                            <span> Created At: {new Date(assistant.createdAt).toLocaleString()}</span> {/* Display creation date */}
                        </li>
                    ))
                ) : (
                    <p className="no-assistants">No assistants found for this user.</p>
                )}
            </ul>
        </div>
    );
};

export default UserAssistants;
