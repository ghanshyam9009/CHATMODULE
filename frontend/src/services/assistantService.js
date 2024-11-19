// services/assistantService.js
const API_URL = 'http://localhost:5000/api/assistants'; // Adjust based on your backend

const createAssistant = async (assistantData) => {
    const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token for authorization
        },
        body: JSON.stringify(assistantData),
    });
    console.log('API Response:', response);

    if (!response.ok) {
        throw new Error('Failed to create assistant');
    }

    return await response.json();
};

const getUserAssistants = async () => {
    const response = await fetch(`${API_URL}/user-assistants`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token for authorization
        },
    });
    console.log('API Response:', response);

    if (!response.ok) {
        throw new Error('Failed to fetch assistants');
    }

    return await response.json();
};

export default { createAssistant, getUserAssistants };
