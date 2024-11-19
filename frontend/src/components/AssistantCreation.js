// src/components/AssistantCreation.js
import React, { useState } from 'react';
import assistantService from '../services/assistantService';
import '../styles/AssistantCreation.css'; // Import the CSS file

const AssistantCreation = ({ fetchAssistants }) => {
    const [name, setName] = useState('');
    const [instructions, setInstructions] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo'); // Default model
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const response = await assistantService.createAssistant({ name, instructions, model });
            setSuccess('Assistant created successfully.');
            setName('');
            setInstructions('');
            setModel('gpt-3.5-turbo');
            fetchAssistants(); // Refresh the assistant list after creation
        } catch (error) {
            setError(error.message || 'Failed to create assistant.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="assistant-creation-container">
            <h2 className="form-title">Create Assistant</h2>
            <form onSubmit={handleSubmit} className="assistant-creation-form">
                <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Assistant Name"
                    required
                />
                <textarea
                    className="input-field"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="System Instructions"
                    required
                    rows="4"
                ></textarea>
                <select
                    className="input-field"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                </select>
                <button
                    type="submit"
                    className={`submit-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Assistant'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </form>
        </div>
    );
};

export default AssistantCreation;
