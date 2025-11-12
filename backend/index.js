require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rhea = require('rhea');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('./middleware/authMiddleware');


const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

app.use(cors());
app.use(express.json());

// --- STATE MANAGEMENT FOR SOLACE ---
let solace = {
    container: null,
    connection: null,
    isConnected: false,
};

// --- AUTH ROUTES ---
// Signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- SOLACE ROUTES ---
// Connect
app.post('/connect', authMiddleware, async (req, res) => {
    const details = req.body;

    try {
        if (solace.isConnected) return res.status(200).json({ message: 'Already connected.' });

        solace.container = rhea.create_container();

        solace.container.on('connection_open', (context) => {
            console.log('Connected to Solace.');
            solace.connection = context.connection;
            solace.isConnected = true;
            context.connection.open_receiver(details.queueName);
            res.status(200).json({ message: 'Successfully connected and subscribed.' });
        });

        solace.container.on('message', async (context) => {
            const message = context.message;
            if (!message || !message.body) return;

            try {
                // Normalize AMQP body to a UTF-8 string
                let rawContent;
                if (message.body?.content && Buffer.isBuffer(message.body.content)) {
                    rawContent = message.body.content.toString('utf8');
                } else if (Buffer.isBuffer(message.body)) {
                    rawContent = message.body.toString('utf8');
                } else if (typeof message.body === 'string') {
                    rawContent = message.body;
                } else {
                    // Fallback for structured types
                    rawContent = JSON.stringify(message.body);
                }

                // Parse JSON if possible; otherwise wrap as raw text
                let parsed;
                try {
                    parsed = JSON.parse(rawContent);
                } catch {
                    parsed = { rawMessage: rawContent };
                }

                await prisma.message.create({ data: { content: parsed } });
                console.log('Message saved.');
            } catch (dbErr) {
                console.error('DB Save Error:', dbErr);
            }
        });

        solace.container.connect({
            host: details.host,
            port: details.port,
            username: details.username,
            password: details.password,
            transport: 'tls',
            reconnect: true
        });
    } catch (err) {
        console.error('Solace Connect Error:', err);
        res.status(500).json({ message: 'Failed to connect to Solace' });
    }
});

// Disconnect
app.post('/disconnect', authMiddleware, (req, res) => {
    if (!solace.connection) return res.status(400).json({ message: 'Not connected' });

    solace.connection.close();
    solace.isConnected = false;
    res.status(200).json({ message: 'Disconnected successfully.' });
});

// Status
app.get('/status', authMiddleware, (req, res) => {
    res.status(200).json({ isConnected: solace.isConnected });
});

// Messages
app.get('/messages', authMiddleware, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({ orderBy: { receivedAt: 'desc' } });
        res.json(messages);
    } catch (err) {
        console.error('Fetch Messages Error:', err);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
});

// --- START SERVER ---
app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
