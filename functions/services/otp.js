const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();

// Create reusable transporter object using your email provider (e.g., Gmail SMTP)
const transporter = nodemailer.createTransport(
{
    service: 'gmail',
    auth: 
    {
        user: process.env.EMAIL_SERVICE_USER,
        pass: process.env.EMAIL_SERVICE_PASS
    }
});

// Function to send OTP email
async function sendOtpEmail(to, otp) 
{
    const mailOptions = 
    {
        from: process.env.EMAIL_SERVICE_USER,
        to: to,
        subject: 'Your OTP for Sign Up',
        text: `Your OTP for email verification is: ${otp}. It will expire in 10 minutes.`,
    };

    try 
    {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent successfully");
    } 
    catch (error) 
    {
        console.error("Error sending OTP:", error);
    }
}

// Function to generate OTP and set expiration time (15 minutes)
function generateOtp(email) 
{
    const otp = crypto.randomInt(1000, 10000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Uncomment this line to send OTP email, for testing, keep it commented
    
    //sendOtpEmail(email, otp).catch((error) => {
        //console.error("Error sending OTP:", error);
    //});

    // COMMENTING THESE OUTS FOR TESTING PURPOSE AND TO AVOID OUR GMAIL TO BE FLAGGED SUSPICIOUS

    return { otp, expirationTime };
}


module.exports = { generateOtp };
