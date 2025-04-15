const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();

const { supabase } = require("../config/supabaseClient.js");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS
    }
});

// Function to send OTP email
async function sendOtpEmail(to, otp) {
    const mailOptions = {
        from: process.env.EMAIL_SERVICE_USER,
        to: to,
        subject: 'Your OTP for Sign Up',
        text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully");
    } catch (error) {
        console.error("Error sending OTP:", error);
    }
}

// Function to save OTP to Supabase
async function saveOtpToSupabase(id, otp) {
    try {
        const { error } = await supabase
            .from('otp_requests')
            .upsert([{ id, otp, created_at: new Date().toISOString() }], { onConflict: ['id'] });

        if (error) {
            console.error("Error saving OTP to Supabase:", error);
            throw error;
        }

        console.log(`OTP saved to Supabase successfully for ID: ${id}`);
    } catch (error) {
        console.error("Unexpected error saving OTP to Supabase:", error);
    }
}

// Function to generate OTP and set expiration time (15 minutes)
async function generateOtp(email) {
    const otp = crypto.randomInt(1000, 10000).toString();

    const userId = email; 

    // Save OTP to Supabase
    await saveOtpToSupabase(userId, otp);

    // Uncomment this line to send OTP email, for testing, keep it commented
    // sendOtpEmail(email, otp).catch((error) => {
    //    console.error("Error sending OTP:", error);
    // });

    // COMMENTING THESE OUTS FOR TESTING PURPOSE AND TO AVOID OUR GMAIL TO BE FLAGGED SUSPICIOUS

    return { otp };
}

module.exports = { generateOtp, saveOtpToSupabase };
