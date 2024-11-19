

// const API_URL = 'http://localhost:5000/api/auth'; // Adjust based on your backend

// const register = async (username, password, tenantName, role) => { // Added 'role' parameter
//     const response = await fetch(`${API_URL}/register`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password, tenantName, role }), // Include role in the body
//     });

//     if (!response.ok) {
//         throw new Error('Registration failed');
//     }

//     return await response.json(); // Assuming it returns { message: "User registered", user: {...} }
// };

// const login = async (username, password) => {
//     const response = await fetch(`${API_URL}/login`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//     });

//     if (!response.ok) {
//         throw new Error('Login failed');
//     }

//     return await response.json(); // Assuming it returns { user: {...}, token: "..." }
// };

// export default { register, login };



// src/services/authService.js

const API_URL = 'http://localhost:5000/api/auth'; // Adjust based on your backend

const register = async (username, password, tenantName, role) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, tenantName, role }),
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return await response.json();
};

const login = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return await response.json();
};

// Logout function
const logout = async () => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Attach token if needed
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }

    return await response.json(); // Optionally handle response if necessary
};

export default { register, login, logout };
