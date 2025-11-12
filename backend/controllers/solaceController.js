// solaceController.js
const rhea = require("rhea");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

let solace = {
  container: null,
  connection: null,
  isConnected: false,
  reconnectTimer: null,
  shouldReconnect: true,
};

// ------------------------------------------------------------
// Utility: Connect to Solace Broker
// ------------------------------------------------------------
function connectToSolace(details) {
  return new Promise((resolve, reject) => {
    if (solace.isConnected && solace.connection) {
      console.log("Already connected to Solace broker");
      return resolve();
    }

    console.log("Connecting to Solace broker...");

    // Clean up any old listeners
    if (solace.container) {
      try {
        solace.container.removeAllListeners();
      } catch (e) {}
    }

    solace.container = rhea.create_container();

    // --- CONNECTION OPEN ---
    solace.container.on("connection_open", (context) => {
      solace.connection = context.connection;
      solace.isConnected = true;
      console.log("Connected to Solace broker");

      // Subscribe to the specified queue
      context.connection.open_receiver(details.queueName);
      resolve();
    });

    // --- MESSAGE RECEIVED ---
    solace.container.on("message", async (context) => {
      try {
        const { message } = context;
        if (!message?.body) return;

        // Extract raw content safely
        let rawContent;
        if (message.body?.content && Buffer.isBuffer(message.body.content)) {
          rawContent = message.body.content.toString("utf8");
        } else if (Buffer.isBuffer(message.body)) {
          rawContent = message.body.toString("utf8");
        } else if (typeof message.body === "string") {
          rawContent = message.body;
        } else {
          rawContent = JSON.stringify(message.body);
        }

        // Try to parse JSON (if valid)
        let parsed;
        try {
          parsed = JSON.parse(rawContent);
        } catch {
          parsed = { rawMessage: rawContent }; // fallback for non-JSON messages
        }

        console.log("📩 Received message:", parsed);

        // Save message directly as JSON (MongoDB JSON field)
        await prisma.message.create({
          data: { content: parsed },
        });

        console.log("Message saved to MongoDB");
      } catch (err) {
        console.error("Error processing message:", err);
      }
    });

    // --- CONNECTION ERROR ---
    solace.container.on("connection_error", (context) => {
      solace.isConnected = false;
      const errorMsg =
        context.error?.description ||
        context.error?.message ||
        "Connection error";
      console.error("Connection error:", errorMsg);
      reject(new Error(errorMsg));
    });

    // --- DISCONNECTED (Auto Reconnect) ---
    solace.container.on("disconnected", () => {
      solace.isConnected = false;
      console.warn("Disconnected from Solace broker.");

      if (solace.shouldReconnect) {
        console.warn("Attempting reconnection in 5 seconds...");
        if (solace.reconnectTimer) clearTimeout(solace.reconnectTimer);

        solace.reconnectTimer = setTimeout(() => {
          connectToSolace(details)
            .then(() => console.log("Reconnected successfully"))
            .catch((err) => console.error("Reconnect failed:", err.message));
        }, 5000);
      }
    });

    // Connect securely via TLS
    solace.container.connect({
      host: details.host,
      port: details.port,
      username: details.username,
      password: details.password,
      transport: "tls",
    });
  });
}

// ------------------------------------------------------------
// Controller: Connect to broker
// ------------------------------------------------------------
exports.connectBroker = async (req, res) => {
  const details = req.body;

  try {
    solace.shouldReconnect = true;
    await connectToSolace(details);
    res.json({ message: "Connected & subscribed to queue successfully." });
  } catch (err) {
    console.error("API Connect Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------------------------
// Controller: Disconnect from broker
// ------------------------------------------------------------
exports.disconnectBroker = (req, res) => {
  try {
    solace.shouldReconnect = false;
    if (solace.connection) {
      console.log("🔌 Closing Solace connection...");
      solace.connection.close();
      solace.connection = null;
      solace.isConnected = false;
      return res.json({ message: "Disconnected successfully." });
    } else {
      return res.status(400).json({ message: "Not connected to Solace." });
    }
  } catch (err) {
    console.error("Error during disconnection:", err);
    res.status(500).json({ message: err.message });
  }
};

// ------------------------------------------------------------
// Controller: Get connection status
// ------------------------------------------------------------
exports.getStatus = (req, res) => {
  res.json({ isConnected: solace.isConnected });
};

// ------------------------------------------------------------
// Controller: Fetch all saved messages
// ------------------------------------------------------------
exports.getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { receivedAt: "desc" },
    });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: err.message });
  }
};
