# Project Documentation

## Overview  
This project manages tenants, users, assistants, and chat sessions with role-based access. Admins have access to user assistants and chat data, while regular users can create assistants and engage in chat sessions.

---

## API Documentation  

### Auth Routes (`/auth`)  
| Method | Endpoint                        | Description                 | Access            |
|--------|---------------------------------|-----------------------------|------------------|
| POST   | `/register`                     | Registers a new user        | Public            |
| POST   | `/login`                        | User login                  | Public            |
| POST   | `/logout`                       | Logs out a user             | Authenticated     |
| GET    | `/tenant/:tenantId/users`       | Fetch all users of a tenant | Admin Only        |

### Assistant Routes (`/assistants`)  
| Method | Endpoint                        | Description                                  | Access        |
|--------|---------------------------------|----------------------------------------------|--------------|
| POST   | `/`                             | Create a new assistant                       | User Only     |
| GET    | `/user-assistants`              | Fetch assistants for logged-in user          | User Only     |
| GET    | `/admin/:userId`                | Fetch assistants for a specific user (Admin) | Admin Only    |

### Chat Routes (`/chats`)  
| Method | Endpoint                               | Description                                      | Access        |
|--------|----------------------------------------|--------------------------------------------------|--------------|
| POST   | `/send`                                | Send a message in a chat session                 | User Only     |
| GET    | `/user/:assistantId/:sessionId`        | Get user chats for a specific assistant session  | User Only     |
| GET    | `/assistant/:assistantId/:sessionId`   | Get assistant chats (Admin access)               | Admin Only    |
| POST   | `/end`                                 | End a chat session                               | User Only     |

---




## frontend Overview

This project is a web application designed for managing users and assistants, with functionalities for registration, login, and chat interactions. The application features a robust backend and a dynamic frontend, providing a seamless user experience.

## Frontend Structure

The frontend is built using React and includes the following pages, each with specific components to facilitate different functionalities:

### 1. **Login Page**
   - **Components:**
     - `LoginForm`: Handles user login by accepting credentials (username and password).

### 2. **Register Page**
   - **Components:**
     - `RegistrationForm`: Allows users to register by providing a username, password, and tenant name.

### 3. **Admin Dashboard**
   - **Components:**
     - `UserList`: Displays a list of users associated with a tenant, fetched from the backend.
     - `UserAssistants`: Shows assistants created by users.
     - `SearchBar`: Enables searching users by their names or roles.
     - `AdminChatPage`: Provides access to chat sessions associated with assistants.

### 4. **Assistant Creation Page**
   - **Components:**
     - `AssistantCreationForm`: Allows admins to create new assistants, including fields for assistant name, model selection, and instructions.
     - `AssistantList`: Displays all assistants created by the admin, with options to view chats.

### 5. **Chat Page**
   - **Components:**
     - `ChatInterface`: Provides the chat functionality for users to interact with the assistants.
     - `ChatHistory`: Displays the history of messages exchanged in the current chat session.

### 6. **User Dashboard**
   - **Components:**
     - `UserAssistantsList`: Shows all assistants associated with the logged-in user.
     - `ChatHistory`: Displays the history of chats related to the user.

## Services

The application makes use of various service files to handle API calls to the backend. These services abstract the logic for fetching and sending data, ensuring a clean separation of concerns.

- **Auth Service**: Manages user registration, login, and logout functionalities.
- **Admin Service**: Fetches users and assistants, and retrieves chat histories for admin users.
- **Assistant Service**: Handles assistant creation and fetching assistants associated with users.
- **Chat Service**: Manages chat sessions, sending messages, and ending sessions.

## API Endpoints

The frontend communicates with the backend using the following endpoints:

- **Authentication**
  - `POST /api/auth/register`: Registers a new user.
  - `POST /api/auth/login`: Authenticates a user.
  - `POST /api/auth/logout`: Logs out the user.
  - `GET /api/auth/tenant/:tenantId/users`: Fetches users by tenant.

- **Assistants**
  - `POST /api/assistants`: Creates a new assistant.
  - `GET /api/assistants/user-assistants`: Fetches assistants associated with the logged-in user.
  - `GET /api/assistants/admin/:userId`: Fetches assistants for a specific user by admin.

- **Chats**
  - `POST /api/chats/send`: Sends a message in the chat.
  - `GET /api/chats/user/:assistantId/:sessionId`: Fetches chats for a specific user and assistant session.
  - `GET /api/chats/assistant/:assistantId/:sessionId`: Fetches chats for an assistant (admin access).
  - `POST /api/chats/end`: Ends a chat session.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Start the development server with `npm start`.

## Conclusion

This project provides a comprehensive platform for user and assistant management, with a focus on enhancing communication through chat functionalities. The frontend is structured to provide an intuitive user experience while adhering to best practices in code organization and separation of concerns.




document dine tunninig 


o achieve document upload, fine-tuning, and chatbot responses using the OpenAI API, you can follow this structured approach:

1. Document Upload
User Interface:

Provide a user interface (UI) where users can upload documents (e.g., PDF, Word files).
Use a file input in your frontend to allow users to select and upload their documents.
Backend Handling:

Create an API endpoint in your backend to handle file uploads.
Use a library like multer (for Node.js) to process incoming file uploads.
Save the uploaded document to a server directory or cloud storage (e.g., AWS S3).





To achieve document upload, fine-tuning, and chatbot responses using the OpenAI API, you can follow this structured approach:

1. Document Upload
User Interface:

Provide a user interface (UI) where users can upload documents (e.g., PDF, Word files).
Use a file input in your frontend to allow users to select and upload their documents.
Backend Handling:

Create an API endpoint in your backend to handle file uploads.
Use a library like multer (for Node.js) to process incoming file uploads.
Save the uploaded document to a server directory or cloud storage (e.g., AWS S3).
Example Code (Node.js):

javascript
Copy code
const multer = require('multer');
const express = require('express');
const app = express();


2. Fine-Tuning
Data Preparation:

After the document is uploaded, extract the relevant text or data. Libraries like pdf-parse or docx can help extract text from PDF or Word files.
Format the extracted text into a training dataset compatible with OpenAI’s fine-tuning requirements (usually JSONL format with prompt and completion pairs).
Fine-Tuning Process:

Use OpenAI's fine-tuning API to train a custom model based on the uploaded document.
Make a POST request to the fine-tuning endpoint with your dataset.



3. Chatbot Response
User Query Handling:

Create another API endpoint where users can send queries or messages to the chatbot.
Use the fine-tuned model for generating responses to user queries.
Generating Responses:

When a user sends a message, make a POST request to the OpenAI API using the fine-tuned model, passing the user message as input.



Summary
Document Upload: Implement a UI for uploading documents, and handle the file upload in the backend.
Fine-Tuning: Extract text from the uploaded document, prepare it for fine-tuning, and use the OpenAI API to create a fine-tuned model.
Chatbot Response: Implement an API endpoint for user queries that utilizes the fine-tuned model to generate responses.
Considerations
Ensure that proper error handling is in place for file uploads and API requests.
Monitor OpenAI API usage to stay within rate limits and budget.
Depending on the size of the documents, consider the time taken for fine-tuning and inform users accordingly.




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
+--------+--------+
|      User       |
+-----------------+
