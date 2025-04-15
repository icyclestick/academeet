// routes/userOperations.js

const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");
const supabase = require("../config/supabaseClient");


// User sign up 
// If the user signed up via OAuth, front-end would be sending JWT Tokens from Supabase Auth
// Else, signUpviaEmail, and returns a JWT Token to front-end
router.post("/sign-up-new-user", async (req, res, next) => 
{
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1];

    const { email, password, username, name } = req.body;

    if (!email || !username || !name) 
    {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try 
    {
        // Check if already in users table (duplicate sign-up)
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (existingUser) {
            return res.status(400).send({ error: "User already exists. Please log in instead." });
        }

        let userId;

        // If OAuth signed up, token exists, manually run middleware
        if (token) 
        {
            req.headers.authorization = `Bearer ${token}`;
            await authenticateToken(req, res, async () => {
                userId = req.user.id;

                // Insert into users table
                const { error: insertError } = await supabase.from("users").insert([
                    {
                        id: userId,
                        email,
                        username,
                        name,
                        email_confirmed: true,
                        student_verified: false,
                    },
                ]);

                if (insertError) {
                    console.error("Insert error:", insertError);
                    return res.status(500).send({ error: "Failed to insert user information." });
                }

                return res.status(200).send({
                    message: "User profile created successfully.",
                    userId,
                });
            });
        }

        // Else, email/password sign up, create auth user, then return JWT token to frontend
        else {
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            });

            if (authError) {
                console.error("Auth error:", authError);
                return res.status(500).send({ error: "Failed to create user in auth." });
            }

            userId = authData.user.id;

            const { error: insertError } = await supabase.from("users").insert([
                {
                    id: userId,
                    email,
                    username,
                    name,
                    email_confirmed: true,
                    student_verified: false,
                },
            ]);

            if (insertError) 
            {
                console.error("Insert error:", insertError);
                return res.status(500).send({ error: "Failed to insert user information." });
            }

            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) 
            {
                console.error("Sign-in error:", signInError);
                return res.status(500).send({ error: "Failed to sign in newly created user." });
            }

            return res.status(200).send({
                token: signInData.session.access_token,
                userId,
            });
        }

    } 
    catch (error) 
    {
        console.error("Error in /sign-up-new-user:", error);
        return res.status(500).send({ error: "Unexpected error occurred." });
    }
});



// Route for choosing avatar
router.post("/choose-avatar", authenticateToken, async (req, res) => {
    const { id } = req.user;
    const { avatar } = req.body;

    // Only allows for a fix choice of avatars
    const allowedAvatars = 
    [
        "penguin", "turtle", "dog", "violet", "spaceman",
        "flamingo", "ghost", "dino", "squid"
    ];

    if (!avatar || !allowedAvatars.includes(avatar)) 
    {
        return res.status(400).send({ error: "Invalid or missing avatar." });
    }

    try 
    {
        const { error } = await supabase
            .from("users")
            .update({ avatar })
            .eq("id", id);

        if (error) 
        {
            console.error("Avatar update error:", error);
            return res.status(500).send({ error: "Failed to update avatar." });
        }

        res.status(200).send({ message: "Avatar updated successfully." });
    } 
    catch (error) 
    {
        console.error("Error in /choose-avatar:", error);
        res.status(500).send({ error: "Unexpected server error." });
    }
});



// NOTE: REMOVE UPDATE EMAIL ON UI/UX?
// Route to update user's details
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
            .select("name, username, program, year_level, study_style, study_time, accountability_level, match_university")
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

        if (Object.keys(updateData).length === 0) 
        {
            return res.status(400).send({ error: "At least one field is required to update" });
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

        // NOTE: PROBABLY NEEDS MORE ERROR CHECKING FOR THE ALLOWABLE VALUES
        if (updateData.program) userData.program = updateData.program;
        if (updateData.year_level) userData.year_level = updateData.year_level;
        if (updateData.study_style) userData.study_style = updateData.study_style;
        if (updateData.study_time) userData.study_time = updateData.study_time;
        if (updateData.accountability_level) userData.accountability_level = updateData.accountability_level;
        if (updateData.match_university !== undefined) userData.match_university = updateData.match_university;
        if (updateData.name) userData.name = updateData.name;
        if (updateData.username) userData.username = updateData.username;
        if (updateData.avatar) userData.avatar = updateData.avatar;

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
