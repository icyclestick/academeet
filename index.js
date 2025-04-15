const express = require("express");

// Import routes
const matchOperationsRoutes = require("./routes/matchOperations");
const authenticateToken = require("./middleware/authenticateToken");
const otp = require("./routes/otp");
const userOperations = require("./routes/userOperations");



const app = express();
app.use(express.json());  


// Apply the authenticateToken middleware for routes that require authentication

// Default route (optional, just for testing)
app.get("/", (req, res) => 
{
    res.send("Hello, Academeet");
});

app.use('/', matchOperationsRoutes);
app.use('/', otp);
app.use('/', userOperations)


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
