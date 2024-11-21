Project Documentation
Overview
This project manages tenants, users, assistants, and chat sessions with role-based access control. Admin users can access assistants and chat data created by other users, while regular users can create assistants, upload documents for fine-tuning, and engage in chat sessions. The platform integrates OpenAI's APIs for fine-tuning and generating chatbot responses.

API Documentation
Auth Routes (/auth)
Method	Endpoint	Description	Access
POST	/register	Registers a new user	Public
POST	/login	User login	Public
POST	/logout	Logs out a user	Authenticated
GET	/tenant/:tenantId/users	Fetch all users of a tenant	Admin Only
Assistant Routes (/assistants)
Method	Endpoint	Description	Access
POST	/	Create a new assistant	User Only
GET	/user-assistants	Fetch assistants for logged-in user	User Only
GET	/admin/:userId	Fetch assistants for a specific user (Admin)	Admin Only
Chat Routes (/chats)
Method	Endpoint	Description	Access
POST	/send	Send a message in a chat session	User Only
GET	/user/:assistantId/:sessionId	Get user chats for a specific assistant session	User Only
GET	/assistant/:assistantId/:sessionId	Get assistant chats (Admin access)	Admin Only
POST	/end	End a chat session	User Only
Document Upload and Fine-Tuning Routes (/documents)
Method	Endpoint	Description	Access
POST	/upload	Upload a document	User Only
POST	/fine-tune	Start fine-tuning with uploaded data	User Only
Frontend Overview
The web application provides user-friendly interfaces for managing users, assistants, document uploads, fine-tuning, and chat interactions. The frontend is built using React, leveraging Tailwind CSS for styling and React Redux for state management.

Frontend Structure
Pages and Components
Login Page

Components:
LoginForm: Accepts username and password for authentication.
Register Page

Components:
RegistrationForm: Allows user registration with tenant information.
Admin Dashboard

Components:
UserList: Displays all users under a tenant.
UserAssistants: Shows assistants created by tenant users.
SearchBar: Enables searching users by name or role.
AdminChatPage: Provides access to chat sessions of tenant users.
User Dashboard

Components:
AssistantCreationForm: Allows assistant creation with fields like assistant name, model, and system instructions.
UserAssistantsList: Displays assistants created by the logged-in user.
ChatHistory: Shows chat history of assistants.
DocumentUploader: Handles document uploads for fine-tuning.
Chat Page

Components:
ChatInterface: Enables user-assistant interaction.
ChatHistory: Displays the history of chats for the session.
Services
The application organizes API calls into separate service files for modularity:

Auth Service: Manages user authentication (login, logout, and registration).
Admin Service: Fetches users, assistants, and chat histories for admin users.
Assistant Service: Handles assistant creation and retrieval for users.
Chat Service: Sends messages, retrieves chat history, and ends sessions.
Document Service: Manages document uploads and triggers fine-tuning processes.
Fine-Tuning Workflow
1. Document Upload
Frontend:

Users upload documents (PDFs, Word files) through a file input in the UI.
The uploaded file is sent to the backend for processing.
Backend:

An API endpoint handles file uploads.
Uses libraries like multer for file handling.
Saves uploaded documents to the server or cloud storage (e.g., AWS S3).
2. Text Extraction and Dataset Creation
Extract text from the document using tools like pdf-parse or docx.
Format extracted text into JSONL format, pairing prompts with completions for training.
3. Fine-Tuning
Submit the prepared dataset to OpenAI's fine-tuning API.
The backend handles the fine-tuning process by making API calls and storing the resulting model ID.
4. Chatbot Integration
Use the fine-tuned model for responding to user queries.
Store chat sessions in the database to allow users and admins to access historical data.
Sequence Diagram
plaintext
Copy code
+-----------------+
|      User       |
+--------+--------+
         |
         | 1. Upload Document
         v
+--------+--------+
|  Web Interface  |
+--------+--------+
         |
         | 2. Send Document
         v
+--------+--------+
| Document Upload |
|     Handler     |
+--------+--------+
         |
         | 3. Save Document
         v
+--------+--------+
|  Data Extraction|
|      Module     |
+--------+--------+
         |
         | 4. Extract Text
         v
+--------+--------+
| Dataset Creator |
+--------+--------+
         |
         | 5. Prepare Dataset
         v
+--------+--------+
|   OpenAI API    |
|   Fine-Tuning   |
+--------+--------+
         |
         | 6. Fine-Tuned Model
         v
+--------+--------+
|  Chatbot Logic  |
+--------+--------+
         |
         | 7. User Queries
         v
+-----------------+
|      User       |
+-----------------+
Installation
Clone the repository.
Navigate to the project directory.
Run npm install to install dependencies.
Start the development server with npm start.
