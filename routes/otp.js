// routes/otp.js

const express = require("express");
const router = express.Router();

const { generateOtp, saveOtpToSupabase } = require("utils/otp.js");
const authenticateToken = require("middleware/authenticateToken.js");
const supabase = require("config/supabaseClient.js");

// Route to send-otp only when the user is not yet verified
router.post("/send-otp", authenticateToken, async (req, res) => 
{ 
    const { id, email } = req.user;

    if (!id || !email) 
    {
        return res.status(400).send({ error: "ID or Email is missing from token" });
    }

    try 
    {
        const { data: users, error: userError } = await supabase
            .from("users")
            .select("email_confirmed", { count: "exact" })
            .eq("id", id);

        if (userError) 
        {
            console.error("Error checking user:", userError);
            return res.status(500).send({ error: "Error checking user verification status" });
        }

        if (users.length > 0 && users[0].email_confirmed) 
        {
            return res.status(400).send({ error: "User is already verified" });
        }

        const { otp } = generateOtp(email);
        await saveOtpToSupabase(id, otp);

        console.log(`OTP sent to ${email}: ${otp}`);
        res.status(200).send({ message: "OTP sent successfully" });
    } 
    catch (error) 
    {
        console.error("Error in /send-otp:", error);
        res.status(500).send({ error: "Error in sending OTP" });
    }
});

// Route to verify otp sent to user.
router.post("/verify-otp", authenticateToken, async (req, res) => 
{
    const { id, email } = req.user;
    const { otp } = req.body;

    if (!id || !otp) 
    {
        return res.status(400).send({ error: "ID or OTP is missing" });
    }

    try {
        const { data: otpData, error: otpError } = await supabase
            .from("otp_requests")
            .select("*")
            .eq("id", id)
            .eq("otp", otp)
            .single();

        if (otpError || !otpData) 
        {
            return res.status(400).send({ error: "Invalid OTP" });
        }

        if (!otpData.created_at) 
        {
            return res.status(400).send({ error: "Invalid OTP data" });
        }

        const createdAt = new Date(otpData.created_at);
        const now = new Date();
        const expirationTime = 15 * 60 * 1000;

        if (now.getTime() - createdAt.getTime() > expirationTime) 
        {
            return res.status(400).send({ error: "OTP has expired" });
        }

        const { data: userData } = await supabase
            .from("users")
            .select("id")
            .eq("id", id)
            .maybeSingle();

        const isStudent = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.ph$/.test(email);

        if (!userData) 
        {
            const { error: insertError } = await supabase
                .from("users")
                .insert([{ id, email, email_confirmed: true, student_verified: isStudent }]);

            if (insertError) 
            {
                console.error("User creation error:", insertError);
                return res.status(500).send({ error: "Failed to create user entry" });
            }
        }
        else 
        {
            const { error: updateError } = await supabase
                .from("users")
                .update({ email_confirmed: true, student_verified: isStudent })
                .eq("id", id);

            if (updateError) 
            {
                return res.status(500).send({ error: "Failed to update email verification status" });
            }
        }

        await supabase.from("otp_requests").delete().eq("id", id);

        res.status(200).send({
            success: isStudent ? "OTP verified and student verified" : "OTP verified but user is not a student",
        });
    } 
    catch (error) 
    {
        console.error("Error in /verify-otp:", error);
        res.status(500).send({ error: "Error in verifying OTP." });
    }
});

module.exports = router;
