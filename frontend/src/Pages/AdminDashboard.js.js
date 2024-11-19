
// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { fetchAssistantsByUser, fetchUsersByTenant } from '../services/adminServices'; 
// import UserData from '../components/UserData'; 
// import UserAssistants from '../components/UserAssistants'; 
// import '../styles/AdminDashboard.css'; 

// const AdminDashboard = () => {
//     const { user } = useContext(AuthContext); 
//     const [users, setUsers] = useState([]);
//     const [assistants, setAssistants] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null); 
//     const [isLoading, setIsLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState(''); // State for search term

//     const getAssistantCountForUser = async (userId) => {
//         try {
//             const assistants = await fetchAssistantsByUser(userId);
//             return assistants.length; 
//         } catch (error) {
//             console.error('Error fetching assistants for user:', error);
//             return 0; 
//         }
//     };

//     const handleUserSelect = async (user) => {
//         setSelectedUser(user); 
//         try {
//             const fetchedAssistants = await fetchAssistantsByUser(user._id);
//             setAssistants(fetchedAssistants);
//         } catch (error) {
//             console.error('Error fetching assistants:', error);
//         }
//     };

//     useEffect(() => {
//         const loadUsers = async () => {
//             if (user && user.tenant?.id) {
//                 try {
//                     const userData = await fetchUsersByTenant(user.tenant.id);
//                     const usersWithAssistantCounts = await Promise.all(
//                         userData.map(async (u) => {
//                             const assistantCount = await getAssistantCountForUser(u._id);
//                             return { ...u, assistantCount };
//                         })
//                     );
//                     setUsers(usersWithAssistantCounts);
//                 } catch (error) {
//                     console.error('Error loading users:', error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             }
//         };
//         loadUsers();
//     }, [user]);

//     const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())); // Filter users based on search term

//     if (isLoading) {
//         return <p>Loading user data...</p>;
//     }

//     return (
//         <div className="admin-dashboard-container">
//             <header className="admin-dashboard-header">
//                 <h1 className="admin-dashboard-title">Admin Dashboard</h1>
//                 {user && (
//                     <div className="admin-user-info">
//                         <p>Welcome, <strong>{user.username}</strong></p>
//                         <p>Tenant: <strong>{user.tenant?.name || 'Unknown Tenant'}</strong></p>
//                     </div>
//                 )}
//             </header>
//             <main className="admin-dashboard-main">
//                 <h2>Users:</h2>
//                 <input 
//                     type="text" 
//                     placeholder="Search users..." 
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)} 
//                     className="search-bar"
//                 />
//                 <UserData users={filteredUsers} onUserSelect={handleUserSelect} />
//                 {selectedUser && <UserAssistants assistants={assistants} user={selectedUser} />}
//             </main>
//         </div>
//     );
// };

// export default AdminDashboard;


// // AdminDashboard.js
// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { fetchAssistantsByUser, fetchUsersByTenant } from '../services/adminServices'; 
// import UserData from '../components/UserData'; 
// import UserAssistants from '../components/UserAssistants'; 
// import '../styles/AdminDashboard.css'; 

// const AdminDashboard = () => {
//     const { user } = useContext(AuthContext); 
//     const [users, setUsers] = useState([]);
//     const [assistants, setAssistants] = useState([]); 
//     const [selectedUser, setSelectedUser] = useState(null); 
//     const [isLoading, setIsLoading] = useState(true);

//     const getAssistantCountForUser = async (userId) => {
//         try {
//             const assistants = await fetchAssistantsByUser(userId);
//             return assistants.length; 
//         } catch (error) {
//             console.error('Error fetching assistants for user:', error);
//             return 0; 
//         }
//     };

//     const handleUserSelect = async (user) => {
//         setSelectedUser(user); 
//         try {
//             const fetchedAssistants = await fetchAssistantsByUser(user._id); 
//             setAssistants(fetchedAssistants); 
//         } catch (error) {
//             console.error('Error fetching assistants:', error);
//             setAssistants([]); 
//         }
//     };

//     useEffect(() => {
//         const loadUsers = async () => {
//             if (user && user.tenant?.id) {
//                 try {
//                     const userData = await fetchUsersByTenant(user.tenant.id);
//                     const usersWithAssistantCounts = await Promise.all(
//                         userData.map(async (u) => {
//                             const assistantCount = await getAssistantCountForUser(u._id);
//                             return { ...u, assistantCount }; 
//                         })
//                     );
//                     setUsers(usersWithAssistantCounts);
//                 } catch (error) {
//                     console.error('Error loading users:', error);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             }
//         };
//         loadUsers();
//     }, [user]);

//     if (isLoading) {
//         return <p>Loading user data...</p>;
//     }

//     return (
//         <div className="admin-dashboard-container">
//             <header className="admin-dashboard-header">
//                 <h1 className="admin-dashboard-title">Admin Dashboard</h1>
//                 {user && (
//                     <div className="admin-user-info">
//                         <p>Welcome, <strong>{user.username}</strong></p>
//                         <p>Tenant: <strong>{user.tenant?.name || 'Unknown Tenant'}</strong></p>
//                     </div>
//                 )}
//             </header>
//             <main className="admin-dashboard-main">
//                 <div className="user-data-container">
//                     <UserData users={users} onUserSelect={handleUserSelect} />
//                 </div>
//                 <div className="user-assistants-container">
//                     {selectedUser && <UserAssistants assistants={assistants} user={selectedUser} />}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default AdminDashboard;

// src/pages/AdminDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthContext } from '../context/AuthContext'; 
import { fetchAssistantsByUser, fetchUsersByTenant } from '../services/adminServices'; 
import UserData from '../components/UserData'; 
import UserAssistants from '../components/UserAssistants'; 
import '../styles/AdminDashboard.css'; 

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext); // Destructure logout function
    const [users, setUsers] = useState([]);
    const [assistants, setAssistants] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

    const getAssistantCountForUser = async (userId) => {
        try {
            const assistants = await fetchAssistantsByUser(userId);
            return assistants.length; 
        } catch (error) {
            console.error('Error fetching assistants for user:', error);
            return 0; 
        }
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user); 
        try {
            const fetchedAssistants = await fetchAssistantsByUser(user._id); 
            setAssistants(fetchedAssistants); 
        } catch (error) {
            console.error('Error fetching assistants:', error);
            setAssistants([]); 
        }
    };

    const handleLogout = async () => {
        await logout(); // Call the logout function
        navigate('/login'); // Navigate to the login page after logging out
    };

    useEffect(() => {
        const loadUsers = async () => {
            if (user && user.tenant?.id) {
                try {
                    const userData = await fetchUsersByTenant(user.tenant.id);
                    const usersWithAssistantCounts = await Promise.all(
                        userData.map(async (u) => {
                            const assistantCount = await getAssistantCountForUser(u._id);
                            return { ...u, assistantCount }; 
                        })
                    );
                    setUsers(usersWithAssistantCounts);
                } catch (error) {
                    console.error('Error loading users:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        loadUsers();
    }, [user]);

    if (isLoading) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="admin-dashboard-container">
            <header className="admin-dashboard-header">
                <h1 className="admin-dashboard-title">Admin Dashboard</h1>
                {user && (
                    <div className="admin-user-info">
                        <p>Welcome, <strong>{user.username}</strong></p>
                        <p>Tenant: <strong>{user.tenant?.name || 'Unknown Tenant'}</strong></p>
                    </div>
                )}
                <button onClick={handleLogout}>Logout</button> {/* Logout button */}
            </header>
            <main className="admin-dashboard-main">
                <div className="user-data-container">
                    <UserData users={users} onUserSelect={handleUserSelect} />
                </div>
                <div className="user-assistants-container">
                    {selectedUser && <UserAssistants assistants={assistants} user={selectedUser} />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
