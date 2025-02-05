require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Chat server is running!');
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

const User = require('./models/User');

app.post('/api/test-user', async (req, res) => {
    try {
        const newUser = new User({
            username: 'testuser',
            firstname: 'Test',
            lastname: 'User',
            password: 'password123',
        });
        await newUser.save();
        res.status(201).send('User created successfully!');
    } catch (error) {
        res.status(500).send('Error creating user: ' + error.message);
    }
});

const bcrypt = require('bcrypt');

// Signup Route
app.post('/api/signup', async (req, res) => {
    const { username, firstname, lastname, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            firstname,
            lastname,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user!', error: error.message });
    }
});


// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password!!' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password!!' });
        }

        // Return success response
        res.status(200).json({ message: 'Login successful', username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in!', error: error.message });
    }
});


// Joining Room
app.post('/api/join-room', async (req, res) => {
    const { username, room } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Update the user's current room
        user.room = room;
        await user.save();

        res.status(200).json({ message: `User joined room: ${room}` });
    } catch (error) {
        res.status(500).json({ message: 'Error joining room', error: error.message });
    }
});


// Leave the Room
app.post('/api/leave-room', async (req, res) => {
    const { username } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found!!' });
        }

        // Remove the user from the room
        user.room = null;
        await user.save();

        res.status(200).json({ message: `User has left the room` });
    } catch (error) {
        res.status(500).json({ message: 'Error leaving room', error: error.message });
    }
});
