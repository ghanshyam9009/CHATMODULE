
// // src/context/AuthContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Corrected named import
// import authService from '../services/authService';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true); // Initial loading state

//     // Login Function
//     const login = async (username, password) => {
//         setLoading(true);
//         try {
//             const response = await authService.login(username, password);
//             // Validate the response structure
//             if (response && response.token && response.user) {
//                 const decodedToken = jwtDecode(response.token);
//                 const isTokenExpired = decodedToken.exp * 1000 < Date.now();

//                 if (isTokenExpired) {
//                     throw new Error('Token expired');
//                 }

//                 setUser(response.user);
//                 localStorage.setItem('token', response.token);
//                 localStorage.setItem('user', JSON.stringify(response.user)); // Persist user data
//             } else {
//                 throw new Error('Invalid response structure');
//             }
//         } catch (error) {
//             console.error('Login failed:', error);
//             throw error; // Rethrow for handling in LoginPage
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Register Function
//     const register = async (username, password, tenantName, role = 'user') => {
//         setLoading(true);
//         try {
//             const response = await authService.register(username, password, tenantName, role);
//             console.log('Server response:', response); // Log the actual response

//             if (response && response.message && response.tenantId) {
//                 // Optionally, automatically log in the user after registration
//                 await login(username, password);
//             } else {
//                 throw new Error('Invalid response structure');
//             }
//         } catch (error) {
//             console.error('Registration failed:', error);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Logout Function
//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('token');
//         localStorage.removeItem('user'); // Remove user data on logout
//     };

//     // Initialize User from localStorage on App Load
//     useEffect(() => {
//         const initializeUser = () => {
//             const token = localStorage.getItem('token');
//             const storedUser = localStorage.getItem('user');

//             if (token && storedUser) {
//                 try {
//                     const decodedToken = jwtDecode(token);
//                     const isTokenExpired = decodedToken.exp * 1000 < Date.now();

//                     if (!isTokenExpired) {
//                         setUser(JSON.parse(storedUser)); // Set user from localStorage
//                     } else {
//                         logout();
//                     }
//                 } catch (error) {
//                     console.error('Invalid token or user data:', error);
//                     logout();
//                 }
//             }
//             setLoading(false); // Set loading to false after initialization
//         };

//         initializeUser();
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };


// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login Function
    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await authService.login(username, password);
            if (response && response.token && response.user) {
                const decodedToken = jwtDecode(response.token);
                const isTokenExpired = decodedToken.exp * 1000 < Date.now();

                if (isTokenExpired) {
                    throw new Error('Token expired');
                }

                setUser(response.user);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Register Function
    const register = async (username, password, tenantName, role = 'user') => {
        setLoading(true);
        try {
            const response = await authService.register(username, password, tenantName, role);
            console.log('Server response:', response);

            if (response && response.message && response.tenantId) {
                await login(username, password);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout Function
    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout(); // Call the logout API
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize User from localStorage on App Load
    useEffect(() => {
        const initializeUser = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const decodedToken = jwtDecode(token);
                    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

                    if (!isTokenExpired) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Invalid token or user data:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initializeUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
