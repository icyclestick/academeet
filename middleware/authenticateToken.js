// Import Supabase client
const { supabase } = require("../config/supabaseClient.js");

// Middleware to be used for all requests
const authenticateToken = async (req, res, next) => 
{
    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) 
    {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        const { data, error } = await supabase.auth.getUser(idToken);
        if (error) 
        {
            return res.status(403).send({ error: "Invalid or expired token" });
        }

        req.user = data.user;
        next();
    } 
    catch (error) 
    {
        return res.status(500).send({ error: "Unexpected error in verifying token" });
    }
};

module.exports = authenticateToken;
