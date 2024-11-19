// const API_URL = 'http://localhost:5000/api';

// // Fetch users by tenant
// export const fetchUsersByTenant = async (tenantId) => {
//     try {
//         const token = localStorage.getItem('token');
//         console.log('API Token:', token); 

//         const response = await fetch(`${API_URL}/auth/tenant/${tenantId}/users`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });

//         if (!response.ok) {
//             console.error('Failed to fetch users:', response.status, response.statusText);
//             throw new Error('Failed to fetch users');
//         }

//         const data = await response.json();
//         console.log('User Data Response:', data); 
//         return data.users || []; 
//     } catch (error) {
//         console.error('Error in API call:', error); 
//         throw error;
//     }
// };

// // Fetch assistants by user (updated path)
// export const fetchAssistantsByUser = async (userId) => {
//     try {
//         const token = localStorage.getItem('token');

//         const response = await fetch(`${API_URL}/assistants/admin/${userId}`, { // Updated path
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//             },
//         });

//         if (!response.ok) {
//             console.error('Failed to fetch assistants:', response.status, response.statusText);
//             throw new Error('Failed to fetch assistants');
//         }

//         const data = await response.json();
//         return data.assistants || []; // Return empty array if no assistants found
//     } catch (error) {
//         console.error('Error fetching assistants:', error);
//         throw error;
//     }
// };



// AdminService.js
const API_URL = 'http://localhost:5000/api';

// Fetch users by tenant
export const fetchUsersByTenant = async (tenantId) => {
    try {
        const token = localStorage.getItem('token');
        console.log('API Token:', token); 

        const response = await fetch(`${API_URL}/auth/tenant/${tenantId}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch users:', response.status, response.statusText);
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        console.log('User Data Response:', data); 
        return data.users || []; 
    } catch (error) {
        console.error('Error in API call:', error); 
        throw error;
    }
};

// Fetch assistants by user
export const fetchAssistantsByUser = async (userId) => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/assistants/admin/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch assistants:', response.status, response.statusText);
            throw new Error('Failed to fetch assistants');
        }

        const data = await response.json();
        return data.assistants || []; // Return empty array if no assistants found
    } catch (error) {
        console.error('Error fetching assistants:', error);
        throw error;
    }
};

// Fetch assistant chats by assistantId and sessionId
export const fetchAssistantChats = async (assistantId, sessionId) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Fetching chats for Assistant:', assistantId, 'Session:', sessionId);

        const response = await fetch(`${API_URL}/assistant/${assistantId}/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch chats:', response.status, response.statusText);
            throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
        console.log('Chat Data Response:', data);
        return data.chats || []; // Return empty array if no chats found
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};


export const fetchAdminChats = async (assistantId) => {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/assistant/${assistantId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch admin chats:', response.status, response.statusText);
            throw new Error('Failed to fetch admin chats');
        }

        const data = await response.json();
        return data.chats || []; // Return empty array if no chats found
    } catch (error) {
        console.error('Error fetching admin chats:', error);
        throw error;
    }
};