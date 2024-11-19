// src/components/AssistantList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import assistantService from '../services/assistantService';
import '../styles/AssistantList.css'; // Import the CSS file

const AssistantList = ({ onAssistantClick }) => {
    const [assistants, setAssistants] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const fetchAssistants = async () => {
        try {
            const response = await assistantService.getUserAssistants();
            setAssistants(response.assistants);
        } catch (error) {
            console.error('Failed to fetch assistants', error);
            setError('Failed to fetch assistants.');
        }
    };

    useEffect(() => {
        fetchAssistants();
    }, []);

    const handleAssistantClick = (assistantId) => {
        navigate(`/chat/${assistantId}`); // Navigate to ChatPage with assistantId
    };

    const filteredAssistants = assistants.filter(assistant =>
        assistant.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="assistant-list-container">
            <h2 className="form-title">Your Assistants</h2>
            <input
                type="text"
                className="search-bar"
                placeholder="Search Assistants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            {filteredAssistants.length === 0 ? (
                <p className="no-assistants">No assistants found.</p>
            ) : (
                <ul className="assistant-list">
                    {filteredAssistants.map((assistant) => (
                        <li
                            key={assistant._id}
                            className="assistant-item"
                            onClick={() => handleAssistantClick(assistant._id)} // Attach click handler
                        >
                            <h3 className="assistant-name">{assistant.name}</h3>
                            <p className="assistant-detail"><strong>Model:</strong> {assistant.model}</p>
                            <p className="assistant-detail"><strong>Instructions:</strong> {assistant.instructions}</p>
                            <p className="assistant-detail"><strong>Created At:</strong> {new Date(assistant.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AssistantList;
