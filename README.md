# 101217770_lab_test1_chat_app



Chat Application
Project Overview:
This is a real-time chat application where users can join predefined chat rooms, send messages, and interact with other users in real time. The application demonstrates the use of Socket.IO for WebSocket communication and MongoDB for user and room management.

Features:
Room-based chat functionality:
Users can select a room from a dropdown.
Users can send messages visible to all members of the room.
User authentication:
Signup and login functionality with password hashing.
Persistent chat rooms:
Predefined rooms are created and stored in a MongoDB database.
Real-time messaging with Socket.IO:
Users see messages as they are sent without refreshing.
Room management:
Users can join and leave rooms.
Friendly UI:
Dropdown for room selection and message input.
Installation:
Prerequisites:
Node.js (v16 or newer recommended)
MongoDB (local or cloud-based)
A terminal or command prompt
Steps to Install and Run:
Clone the repository:

bash
Copy
Edit
git clone https://github.com/YasamanMVS/101217770_lab_test1_chat_app.git
cd 101217770_lab_test1_chat_app
Navigate to the server directory:

bash
Copy
Edit
cd server
Install server dependencies:

bash
Copy
Edit
npm install
Create a .env file in the server directory and add the following:

ini
Copy
Edit
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
Start the server:

bash
Copy
Edit
npm run dev
Navigate to the client directory (if applicable) to set up the client.

Note: If index.html is a standalone file, simply open it in your browser.

Usage:
Running the Application:
Start the server using npm run dev in the server directory.
Open the index.html file in your browser.
Interacting with the App:
Enter a username.
Select a chat room from the dropdown.
Click "Join Room."
Type messages and interact with other users in the chat room.
To leave the room, click "Leave Room."
Project Structure:
bash
Copy
Edit
101217770_lab_test1_chat_app/
│
├── server/
│   ├── index.js              # Main server logic
│   ├── models/
│   │   ├── User.js           # Mongoose schema for users
│   │   ├── Room.js           # Mongoose schema for rooms
│   ├── package.json          # Server dependencies
│   ├── .env                  # Environment variables
│
├── client/
│   ├── index.html            # Frontend HTML
│
├── README.md                 # Project documentation
API Endpoints:
POST /api/signup - Register a new user.
POST /api/login - Login with an existing user account.
GET /api/rooms - Fetch the list of chat rooms.
POST /api/join-room - Join a specific chat room.
POST /api/leave-room - Leave a chat room.
Technologies Used:
Backend:
Node.js
Express.js
MongoDB with Mongoose
Socket.IO
Frontend:
HTML5, CSS, JavaScript
Future Enhancements:
Add private messaging between users.
Show typing indicators when a user is typing.
Save chat history and display it when users rejoin.
