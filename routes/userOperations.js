// routes/userOperations.js

const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const supabase = require("../config/supabaseClient");


// Route to update or set a user's details
router.post("/update-user-details", authenticateToken, async (req, res) => {
    const { id } = req.user;
    const updateData = req.body;

    if (!id) 
    {
        return res.status(400).send({ error: "Token has no ID or is invalid" });
    }

    try 
    {
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("email_confirmed, name, username, program, year_level, study_style, study_time, accountability_level, match_university")
            .eq("id", id)
            .single();

        if (userError) 
        {
            console.error("Error fetching user:", userError);
            return res.status(500).send({ error: "Error retrieving user details" });
        }

        if (!userData) 
        {
            return res.status(400).send({ error: "User does not exist" });
        }

        if (!userData.email_confirmed) 
        {
            return res.status(403).send({ error: "Email must be verified before updating details" });
        }

        if (Object.keys(updateData).length === 0) 
        {
            return res.status(400).send({ error: "At least one field is required to update" });
        }

        if (!userData.name && !userData.username) 
        {
            if (!updateData.name || !updateData.username) 
            {
                return res.status(400).send({ error: "Name and Username are required initially" });
            }
        }

        if (updateData.username) 
        {
            updateData.username = updateData.username.toLowerCase();

            const { data: existingUser, error: usernameError } = await supabase
                .from("users")
                .select("id")
                .eq("username", updateData.username)
                .maybeSingle();

            if (usernameError) 
            {
                console.error("Error checking username:", usernameError);
                return res.status(500).send({ error: "Error checking username availability" });
            }

            if (existingUser && existingUser.id !== id) 
            {
                return res.status(400).send({ error: "Username is already taken" });
            }
        }

        if (updateData.program) userData.program = updateData.program;
        if (updateData.year_level) userData.year_level = updateData.year_level;
        if (updateData.study_style) userData.study_style = updateData.study_style;
        if (updateData.study_time) userData.study_time = updateData.study_time;
        if (updateData.accountability_level) userData.accountability_level = updateData.accountability_level;
        if (updateData.match_university !== undefined) userData.match_university = updateData.match_university;
        if (updateData.name) userData.name = updateData.name;
        if (updateData.username) userData.username = updateData.username;

        const { error: updateError } = await supabase
            .from("users")
            .update(userData)
            .eq("id", id);

        if (updateError) 
        {
            console.error("Error updating user:", updateError);
            return res.status(500).send({ error: "Unable to update user details" });
        }

        return res.status(200).send({ success: "User details updated successfully" });
    } 
    catch (error) 
    {
        console.error("Unexpected error updating user:", error);
        return res.status(500).send({ error: "Unexpected error when updating user details" });
    }
});

module.exports = router;
