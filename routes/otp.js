const express = require("express");
const router = express.Router();

const { generateOtp, saveOtpToSupabase } = require("../utils/otp.js");
const supabase = require("../config/supabaseClient");

module.exports = router;

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ error: "Email is required" });
    }

    try {
        // If a user already exists with this email, block OTP
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (userError) {
            console.error("Error checking user:", userError);
            return res.status(500).send({ error: "Error checking existing user" });
        }

        if (user) {
            return res.status(400).send({ error: "User already exists" });
        }

        // Generate OTP and save using a temporary ID (based on email)
        const { otp } = generateOtp(email);
        const tempId = `temp:${Buffer.from(email).toString("base64")}`;
        await saveOtpToSupabase(tempId, otp);

        console.log(`OTP sent to ${email}: ${otp}`);
        res.status(200).send({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in /send-otp:", error);
        res.status(500).send({ error: "Error in sending OTP" });
    }
});

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).send({ error: "Email or OTP is missing" });
    }

    const tempId = `temp:${Buffer.from(email).toString("base64")}`;

    try {
        // Fetch OTP request
        const { data: otpData, error: otpError } = await supabase
            .from("otp_requests")
            .select("*")
            .eq("id", tempId)
            .eq("otp", otp)
            .single();

        if (otpError || !otpData) {
            return res.status(400).send({ error: "Invalid OTP" });
        }

        const createdAt = new Date(otpData.created_at);
        const now = new Date();
        const expirationTime = 15 * 60 * 1000;

        if (now.getTime() - createdAt.getTime() > expirationTime) {
            return res.status(400).send({ error: "OTP has expired" });
        }

        // Clean up used OTP
        await supabase.from("otp_requests").delete().eq("id", tempId);

        return res.status(200).send({ message: "OTP verified. Proceed to create your account." });
    } catch (error) {
        console.error("Error in /verify-otp:", error);
        return res.status(500).send({ error: "Error in verifying OTP." });
    }
});


module.exports = router;
