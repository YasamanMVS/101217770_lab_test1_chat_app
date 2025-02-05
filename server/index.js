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

