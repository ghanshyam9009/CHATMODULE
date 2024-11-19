// // src/components/Dashboard.js

// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import AssistantCreation from '../components/AssistantCreation';
// import AssistantList from '../components/AssistantList';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Dashboard.css'; // Import the CSS file

// const Dashboard = () => {
//     const { user } = useContext(AuthContext);
//     const [isLoading, setIsLoading] = useState(true); // Add loading state
//     const navigate = useNavigate(); // Initialize useNavigate

//     useEffect(() => {
//         // Simulate a slight delay to fetch user data after reload
//         if (user) setIsLoading(false);
//     }, [user]);

//     const handleAssistantClick = (assistantId) => {
        
//         navigate(`/chat/${assistantId}`); // Navigate to ChatPage with assistantId
//     };

//     if (isLoading) {
//         return <p>Loading user data...</p>; // Display loading message until data is ready
//     }

//     return (
//         <div className="dashboard-container">
//             <header className="dashboard-header">
//                 <h1 className="dashboard-title">Dashboard</h1>
//                 {user && (
//                     <div className="user-info">
//                         <p className="user-name">
//                             Welcome, <strong>{user.username}</strong>
//                         </p>
//                         <p className="tenant-name">
//                             Tenant: <strong>{user.tenant?.name || 'Unknown Tenant'}</strong>
//                         </p>
//                     </div>
//                 )}
//             </header>
//             <main className="dashboard-main">
//                 <div className="assistant-creation-section">
//                     <AssistantCreation fetchAssistants={() => { /* Optional function */ }} />
//                 </div>
//                 <div className="assistant-list-section">
//                     <AssistantList onAssistantClick={handleAssistantClick} /> {/* Pass the handler */}
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Dashboard;


// // src/components/Dashboard.js

// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import AssistantCreation from '../components/AssistantCreation';
// import AssistantList from '../components/AssistantList';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Dashboard.css'; // Import the CSS file

// const Dashboard = () => {
//     const { user } = useContext(AuthContext);
//     const [assistants, setAssistants] = useState([]); // State to hold assistants
//     const [isLoading, setIsLoading] = useState(true); // Add loading state
//     const navigate = useNavigate(); // Initialize useNavigate

//     useEffect(() => {
//         // Check if user is loaded
//         console.log('User:', user); // Log the user object to check its structure
//         if (user) {
//             setIsLoading(false);
//             fetchAssistants(); // Fetch assistants when user is available
//         }
//     }, [user]);

//     // Function to fetch assistants from the API
//     const fetchAssistants = async () => {
//         try {
//             const response = await fetch('/api/assistants'); // Adjust the URL as necessary
//             const data = await response.json();
//             console.log('Assistants fetched:', data); // Log the data received
//             if (data.assistants) {
//                 setAssistants(data.assistants); // Update state with fetched assistants
//             }
//         } catch (error) {
//             console.error('Error fetching assistants:', error);
//         }
//     };

//     const handleAssistantClick = (assistantId) => {
//         navigate(`/chat/${assistantId}`); // Navigate to ChatPage with assistantId
//     };

//     if (isLoading) {
//         return <p>Loading user data...</p>; // Display loading message until data is ready
//     }

//     return (
//         <div className="dashboard-container">
//             <header className="dashboard-header">
//                 <h1 className="dashboard-title">Dashboard</h1>
//                 {user && (
//                     <div className="user-info">
//                         <p className="user-name">
//                             Welcome, <strong>{user.username}</strong>
//                         </p>
//                         <p className="tenant-name">
//                             Tenant: <strong>{user.tenant?.name || 'Unknown Tenant'}</strong>
//                         </p>
//                         {/* <p>User ID: {user.id}</p> */}
//                         {/* <p>Tenant ID: {user.tenant?.id || 'Tenant ID not available'}</p> Log if tenant ID is not available */}
//                     </div>
//                 )}
//             </header>
//             <main className="dashboard-main">
//                 <div className="assistant-creation-section">
//                     <AssistantCreation fetchAssistants={fetchAssistants} />
//                 </div>
//                 <div className="assistant-list-section">
//                     <AssistantList onAssistantClick={handleAssistantClick} assistants={assistants} /> {/* Pass the assistants to the list */}
//                 </div>
//             </main>
//             <h2>Your Assistants:</h2>
//             {assistants.length > 0 ? (
//                 <ul>
//                     {assistants.map((assistant) => (
//                         <li key={assistant._id}>
//                             <p>Name: {assistant.name}</p>
//                             <p>User ID: {assistant.userId}</p>
//                             <p>Tenant ID: {assistant.tenantId}</p>
//                             <p>Model: {assistant.model}</p>
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No assistants available.</p>
//             )}
//         </div>
//     );
// };

// export default Dashboard;
// src/pages/Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AssistantCreation from '../components/AssistantCreation';
import AssistantList from '../components/AssistantList';
import { AuthContext } from '../context/AuthContext';
import '../styles/Dashboard.css'; // Import the CSS file

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext); // Get logout function
    const [assistants, setAssistants] = useState([]); // State to hold assistants
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        console.log('User:', user); // Log the user object to check its structure
        if (user) {
            setIsLoading(false);
            fetchAssistants(); // Fetch assistants when user is available
        }
    }, [user]);

    const fetchAssistants = async () => {
        try {
            const response = await fetch('/api/assistants'); // Adjust the URL as necessary
            const data = await response.json();
            console.log('Assistants fetched:', data); // Log the data received
            if (data.assistants) {
                setAssistants(data.assistants); // Update state with fetched assistants
            }
        } catch (error) {
            console.error('Error fetching assistants:', error);
        }
    };

    const handleAssistantClick = (assistantId) => {
        navigate(`/chat/${assistantId}`); // Navigate to ChatPage with assistantId
    };

    const handleLogout = async () => {
        await logout(); // Call the logout function
        navigate('/login'); // Navigate to the login page after logging out
    };

    if (isLoading) {
        return <p>Loading user data...</p>; // Display loading message until data is ready
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Dashboard</h1>
                {user && (
                    <div className="user-info">
                        <p className="user-name">
                            Welcome, <strong>{user.username}</strong>
                        </p>
                        <p className="tenant-name">
                            Tenant: <strong>{user.tenant?.name || 'Unknown Tenant'}</strong>
                        </p>
                        <button onClick={handleLogout}>Logout</button> {/* Update logout button */ }
                    </div>
                )}
            </header>
            <main className="dashboard-main">
                <div className="assistant-creation-section">
                    <AssistantCreation fetchAssistants={fetchAssistants} />
                </div>
                <div className="assistant-list-section">
                    <AssistantList onAssistantClick={handleAssistantClick} assistants={assistants} />
                </div>
            </main>
            <h2>Your Assistants:</h2>
            {assistants.length > 0 ? (
                <ul>
                    {assistants.map((assistant) => (
                        <li key={assistant._id}>
                            <p>Name: {assistant.name}</p>
                            <p>User ID: {assistant.userId}</p>
                            <p>Tenant ID: {assistant.tenantId}</p>
                            <p>Model: {assistant.model}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No assistants available.</p>
            )}
        </div>
    );
};

export default Dashboard;
