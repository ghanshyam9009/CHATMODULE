// import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Registerpage.css'; // Import the CSS file

// const RegisterPage = () => {
//     const { register } = useContext(AuthContext);
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [tenantName, setTenantName] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             await register(username, password, tenantName);
//             navigate('/login'); // Redirect to login page
//         } catch (error) {
//             alert(error.message);
//         }
//     };

//     return (
//         <div className="register-container">
//             <h1 className="form-title">Register</h1>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     className="input-field"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     placeholder="Username"
//                     required
//                 />
//                 <input
//                     type="password"
//                     className="input-field"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Password"
//                     required
//                 />
//                 <input
//                     type="text"
//                     className="input-field"
//                     value={tenantName}
//                     onChange={(e) => setTenantName(e.target.value)}
//                     placeholder="Tenant Name"
//                     required
//                 />
//                 <button type="submit" className="submit-button">Register</button>
//             </form>
//             <p className="form-footer">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
//         </div>
//     );
// };

// export default RegisterPage;



import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Registerpage.css'; // Import the CSS file

const RegisterPage = () => {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [userType, setUserType] = useState('user'); // Default to 'user'
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, tenantName, userType); // Pass userType to register
            navigate('/login'); // Redirect to login page
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="register-container">
            <h1 className="form-title">Register</h1>
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
                <input
                    type="text"
                    className="input-field"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Tenant Name"
                    required
                />
                
                <div className="user-type-container">
                    <label>
                        <input
                            type="radio"
                            value="admin"
                            checked={userType === 'admin'}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        Admin
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="user"
                            checked={userType === 'user'}
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        User
                    </label>
                </div>

                <button type="submit" className="submit-button">Register</button>
            </form>
            <p className="form-footer">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
        </div>
    );
};

export default RegisterPage;


