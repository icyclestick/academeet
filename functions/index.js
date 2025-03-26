const express = require('express');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { generateOtp } = require('./services/otp'); // Import the OTP service


// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp(); // No need for credentials in the emulator
}


const app = express();  
app.use(express.json());


// middleware for auth token verification
const authenticateToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) 
    {
        return res.status(401).send({ "Unauthorized": "No token provided" });
    }

    try 
    {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // token that would be use on all routes after passing this middleware
        next();
    } 
    catch (error) 
    {
        return res.status(403).send({ "Unauthorized": "Invalid token" });
    }
};



app.post("/send-otp", authenticateToken, async (req, res) => 
    {
        const { uid, email } = req.user; 
    
        // Debug log
        console.log(`UID: ${uid}, Email: ${email}`); 
    
        // Ensure both UID and email are present
        if (!uid || !email) 
        {
            return res.status(400).send({ "Error": "UID or Email is missing from token" });
        }
    
        try 
        {
            // Check if the user already exists and is verified
            const userRef = admin.firestore().collection("users").doc(uid);
            const userDoc = await userRef.get();
    
            if (userDoc.exists && userDoc.data().emailVerified) 
            {
                return res.status(400).send({ "Error": "User is already verified" });
            }
    
            // Generate OTP and expiration time
            const { otp, expirationTime } = generateOtp(email);
            
            // Save OTP to Firestore
            await saveOtpToFirestore(uid, otp, expirationTime);
    
            return res.status(200).send({ "Success": "OTP sent successfully" });
        } 
        catch (error) 
        {
            console.error("Error handling OTP request:", error);
            return res.status(500).send({ "Error": "Unable to process OTP request" });
        }
    });
    

    
// save to firestore the otp
async function saveOtpToFirestore(uid, otp, expirationTime) 
{
    try 
    {
        const otpRef = admin.firestore().collection("otp_requests").doc(uid);
        await otpRef.set({
            uid: uid,
            otp: otp,
            expirationTime: expirationTime,
        });

        console.log(`OTP saved to Firestore successfully for UID: ${uid}`);
    } 
    catch (error) 
    {
        console.error("Error saving OTP to Firestore:", error);
    }
}
    
    
    
// Route to verify OTP
// Route to verify OTP
// Route to verify OTP
app.post("/verify-otp", authenticateToken, async (req, res) => 
    {
        const { otp } = req.body;
        const { uid, email } = req.user;  
    
        if (!otp) 
        {
            return res.status(400).send({ "Error": "OTP is required" });
        }
    
        try 
        {
            // Fetch OTP from Firestore using UID
            const otpRef = admin.firestore().collection("otp_requests").doc(uid);
            const otpDoc = await otpRef.get();
    
            if (!otpDoc.exists) 
            {
                return res.status(400).send({ "Error": "OTP not found or expired" });
            }
    
            const otpData = otpDoc.data();
            const storedOtp = otpData.otp;
            const expirationTime = otpData.expirationTime;
    
            // Check if OTP has expired
            if (Date.now() > expirationTime) 
            {
                return res.status(400).send({ "Error": "OTP has expired" });
            }
            console.log(`Stored Expiration Time: ${expirationTime}, Current Time: ${Date.now()}`);
    
    
            // Check if the provided OTP matches the stored OTP
            if (otp !== storedOtp) 
            {
                return res.status(400).send({ "Error": "Invalid OTP" });
            }
    
            const userRef = admin.firestore().collection("users").doc(uid);
            const userDoc = await userRef.get();
    
            // If user doesn't exist, create the user document with full schema
            if (!userDoc.exists) 
            {
                await userRef.set({
                    email,
                    username: null,
                    profilePic: '', 
                    bio: '',         
                    university: '',  
                    yearLevel: '',   
                    studyPreferences: {}, 
                    studentVerified: null, // Will be updated below
                    activeMatch: null,    
                    emailVerified: true, 
                    createdAt: FieldValue.serverTimestamp()
                });
            }
    
            // Regex pattern to check if email domain is .edu.ph
            const isStudent = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.ph$/.test(email);
    
            // Update studentVerified field based on the email domain
            await userRef.update({ studentVerified: isStudent, emailVerified: true });
            console.log(`User ${uid} verification status updated.`);
    
            // Delete the OTP after successful verification
            await otpRef.delete();
    
            return res.status(200).send({
                "Success": isStudent
                    ? "OTP verified and student verified"
                    : "OTP verified but user is not a student"
            });
    
        } 
        catch (error) 
        {
            console.error("Error verifying OTP:", error);
            return res.status(500).send({ "Error": "Unable to verify OTP" });
        }
    });
    
app.post("/update-user-details", authenticateToken, async (req, res) => {
    const uid = req.user.uid;
    const updateData = req.body;

    if (!uid) 
    {
        return res.status(400).send({ "Error": "Token has no UID or is invalid" });
    }

    if (updateData.username) 
    {
        updateData.username = updateData.username.toLowerCase(); // Convert to lowercase

        const usernameQuery = await admin.firestore()
            .collection("users")
            .where("username", "==", updateData.username)
            .get();

        if (!usernameQuery.empty) 
        {
            return res.status(400).send({ "Error": "Username is already taken" });
        }
    }

    try 
    {
        const userRef = admin.firestore().collection("users").doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) 
        {
            return res.status(400).send({ "Error": "User does not exist" });
        }

        const userData = userDoc.data();

        // Ensure email is verified before updating any details
        if (!userData.emailVerified) 
        {
            return res.status(403).send({ "Error": "Email must be verified before updating details" });
        }

        // Ensure at least one field is provided
        if (Object.keys(updateData).length === 0) 
        {
            return res.status(400).send({ "Error": "At least one field is required to update" });
        }

        // Ensure name and username are set initially
        if (!userData.name && !userData.username && (!updateData.name || !updateData.username)) 
        {
            return res.status(400).send({ "Error": "Name and Username are required initially" });
        }

        // Log the update for debugging
        console.log(`Updating user ${uid} with data:`, updateData);

        // Update user details
        await userRef.update(updateData);

        return res.status(200).send({ "Success": "User details updated successfully" });
    } 
    catch (error) 
    {
        console.error("Error updating user details:", error);
        return res.status(500).send({ "Error": "Unable to update user details in Firestore" });
    }
});




exports.api = functions.https.onRequest(app);
