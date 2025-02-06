require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Room = require('./models/Room');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Chat server is running!');
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error.message));

// Create Default Rooms
const createRooms = async () => {
    const rooms = ['Full Stack', 'DevOps', 'NodeJS', 'Sports'];
    try {
        for (const room of rooms) {
            const existingRoom = await Room.findOne({ name: room });
            if (!existingRoom) {
                await new Room({ name: room }).save();
                console.log(`Room created: ${room}`);
            }
        }
    } catch (error) {
        console.error('Error creating rooms:', error.message);
    }
};
createRooms();

// API Routes
app.post('/api/signup', async (req, res) => {
    const { username, firstname, lastname, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, firstname, lastname, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful', username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }
});

// Room-based Chat (Socket.IO)
io.on('connection', (socket) => {
    console.log('A user connected');

    // Joining Room
    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined room: ${room}`);
        socket.to(room).emit('message', { username: 'System', message: `${username} has joined the room` });
    });

    // Leaving room
    socket.on('leaveRoom', ({ username, room }) => {
        socket.leave(room);
        console.log(`${username} left room: ${room}`);
        socket.to(room).emit('message', { username: 'System', message: `${username} has left the room` });
    });

    // Sending messages
    socket.on('sendMessage', ({ username, room, message }) => {
        console.log(`Message from ${username} in ${room}: ${message}`);
        
        // Emit message to the room (for all users including the sender)
        io.to(room).emit('message', { username, message });
    });

    // Disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
