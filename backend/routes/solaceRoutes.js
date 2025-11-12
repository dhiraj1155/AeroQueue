const authenticateToken = require("./jwtMiddleware");

// --- Protect Solace Routes ---
app.post('/connect', authenticateToken, async (req, res) => {
    const connectionDetails = req.body;
    try {
        await connectToSolace(connectionDetails);
        res.status(200).json({ message: 'Successfully connected and subscribed to queue.' });
    } catch (error) {
        console.error("API Connect Error:", error.message);
        res.status(500).json({ message: error.message || "An unknown error occurred." });
    }
});

app.post('/disconnect', authenticateToken, (req, res) => {
    if (solace.connection) {
        console.log("Closing connection to Solace...");
        solace.connection.close();
        solace.isConnected = false;
        res.status(200).json({ message: 'Disconnected successfully.' });
    } else {
        res.status(400).json({ message: 'Not currently connected.' });
    }
});

app.get('/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await prisma.message.findMany({ orderBy: { receivedAt: 'desc' } });
        res.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        res.status(500).json({ error: 'Could not retrieve messages.' });
    }
});

app.get('/status', authenticateToken, (req, res) => {
    res.status(200).json({ isConnected: solace.isConnected });
});
