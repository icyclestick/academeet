const express = require("express");

// Import the required route modules
const matchOperationsRoutes = require("./routes/matchOperations");
const authenticateToken = require("./middleware/authenticateToken");



const app = express();

// Middleware setup
app.use(express.json());  // Built-in middleware for parsing application/json

// Apply the authenticateToken middleware for routes that require authentication
// If all match-related routes require authentication, use it globally for /api/*
app.use("/api", authenticateToken, matchOperationsRoutes); // Apply middleware globally to match-related routes

// Default route (optional, just for testing)
app.get("/", (req, res) => {
    res.send("Welcome to the Matchmaking API!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
