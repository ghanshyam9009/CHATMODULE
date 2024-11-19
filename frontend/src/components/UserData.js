
// import React from 'react';
// import '../styles/Userdata.css'; // Import your styles

// const UserData = ({ users, onUserSelect }) => {
//     return (
//         <div className="user-data-container">
//             <h2>User List</h2>
//             <ul className="user-list">
//                 {users.map(user => (
//                     <li key={user._id} onClick={() => onUserSelect(user)} className="user-item">
//                         <div className="user-details">
//                             <span>{user.username}</span>
//                             <span>{user.assistantCount} Assistants</span>
//                         </div>
//                         <div className="user-date">
//                             <span>Created At: {new Date(user.createdAt).toLocaleString()}</span>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default UserData;




// UserData.js
import React, { useState } from 'react';
import '../styles/Userdata.css'; // Import your styles

const UserData = ({ users, onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="user-data-container">
            <h2>User List</h2>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <ul className="user-list">
                {filteredUsers.map(user => (
                    <li key={user._id} onClick={() => onUserSelect(user)}>
                        <span>{user.username}</span>
                        <span>{user.assistantCount} Assistants</span>
                        <span>Created At: {new Date(user.createdAt).toLocaleString()}</span> {/* Display creation date */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserData;
