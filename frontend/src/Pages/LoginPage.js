import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Loginpage.css'; // Import the CSS file

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, user } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
            if (user) {
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Login error:', error.message);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="form-title">Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="submit-button">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <p className="form-footer">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a></p>
        </div>
    );
};

export default LoginPage;
