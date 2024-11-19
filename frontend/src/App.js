import React from 'react';
import { Navigate } from 'react-router-dom';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DashboardPage from './Pages/Dashboardpage';
// import AdminPanel from './Pages/AdminPanel';
import './index.css'; // Adjust the path as necessary
import ChatPage from './Pages/ChatPage';
import AdminDashboard from './Pages/AdminDashboard.js';


// import Header from './components/Header';
// import Footer from './components/Footer';

function App() {
    return (
        <Router>
            {/* <Header /> */}
            <Routes>              
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        // <PrivateRoute>
                            <DashboardPage />
                        // </PrivateRoute>
                    }
                />
                <Route path="/admin" element={<AdminDashboard />} /> 
                <Route
                    path="/chat/:assistantId"
                    element={
                        // <PrivateRoute>
                            <ChatPage />
                        // </PrivateRoute>
                    }
                />
                {/* Redirect any unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            {/* <Footer /> */}
        </Router>
    );
}

export default App;

