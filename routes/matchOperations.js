const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken.js");
const supabase = require("../config/supabaseClient.js");
const { StreamChat } = require("stream-chat");
const process = require("process");


// Route for updating the match quiz or setting for the first time
router.post("/match-quiz", authenticateToken, async (req, res) => 
{
    const { id } = req.user;
    const { program, year_level, study_time, accountability_level, match_university } = req.body;

    if (!program || !year_level || !study_time || !accountability_level || match_university === undefined) 
    {
        return res.status(400).send({ error: "All fields are required" });
    }

    try 
    {
        const { error } = await supabase
            .from("users")
            .update({ 
                program, 
                year_level, 
                study_time, 
                accountability_level, 
                match_university 
            })
            .eq("id", id);

        if (error) 
        {
            return res.status(500).send({ error: "Error saving match quiz data" });
        }

        return res.status(200).send({ success: "Match quiz data saved successfully" });

    } 
    catch (error) 
    {
        console.error("Error saving match quiz data:", error);
        return res.status(500).send({ error: "Unexpected error" });
    }
});


// Route for adding the user to the looking_match queue. Can just be called subsequently after the route for updating for the find a study match quiz.
router.post("/look-match", authenticateToken, async (req, res) => 
{
    const { id } = req.user;

    if (!id) 
    {
        return res.status(400).send({ error: "User ID is missing" });
    }

    try 
    {
        const { error } = await supabase
            .from("looking_match")
            .insert([{ user_id: id }]);

        if (error) 
        {
            return res.status(500).send({ error: "Failed to add to look-match" });
        }

        res.status(200).send({ success: "User is now looking for a match" });
    } 
    catch (error) 
    {
        console.error("Error in /look-match:", error);
        res.status(500).send({ error: "Unexpected error" });
    }
});


// Removes user from the looking_match queue.
router.post("/opt-out", authenticateToken, async (req, res) => 
{
    const { id } = req.user;

    if (!id) 
    {
        return res.status(400).send({ error: "Token has no ID or is invalid" });
    }

    try 
    {
        const { error } = await supabase
            .from("looking_match")
            .delete()
            .eq("user_id", id);

        if (error) 
        {
            console.error("Error opting out:", error);
            return res.status(500).send({ error: "Unable to opt out" });
        }

        return res.status(200).send({ success: "Successfully opted out of the match pool" });
    } 
    catch (error) 
    {
        console.error("Unexpected error opting out:", error);
        return res.status(500).send({ error: "Unexpected error when opting out" });
    }
});

// Listener for added user in the looking_match db to run the matching algorithm with
supabase
    .channel('looking_match')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'looking_match' }, async payload => {
        console.log('New match:', payload);
        await findMatch(); 
    })
    .subscribe();

let lastCheckedTime = new Date().toISOString();

async function findMatch() 
{
    try 
    {
        const { data: lookingForMatch, error } = await supabase
            .from("looking_match")
            .select("user_id, created_at")
            .gt("created_at", lastCheckedTime)
            .order("created_at", { ascending: true });

        if (error) 
        {
            console.error("Error fetching looking for match users:", error);
            return;
        }

        lastCheckedTime = new Date().toISOString(); 

        for (let i = 0; i < lookingForMatch.length; i++) 
        {
            const user1 = lookingForMatch[i];

            for (let j = i + 1; j < lookingForMatch.length; j++) 
            {
                const user2 = lookingForMatch[j];

                const { data: user1Details, error: user1Error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user1.user_id)
                    .single();

                const { data: user2Details, error: user2Error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user2.user_id)
                    .single();

                if (user1Error || user2Error) 
                {
                    console.error("Error fetching user details:", user1Error || user2Error);
                    continue;
                }

                const matchScore = calculateMatch(user1Details, user2Details);

                if (matchScore >= 70) 
                {
                    const matchChannelId = `match-${Date.now()}`;
                    const chatResponse = await createStreamChatChannel(user1.user_id, user2.user_id, matchChannelId);

                    if (chatResponse.error) 
                    {
                        console.error("Error creating chat channel:", chatResponse.error);
                        continue;
                    }

                    await supabase.from("matches").insert([
                        {
                            user1_id: user1.user_id,
                            user2_id: user2.user_id,
                            match_score: matchScore,
                            match_channel_id: matchChannelId,
                            status: "active"
                        }
                    ]);

                    await supabase.from("looking_match").delete().eq("user_id", user1.user_id);
                    await supabase.from("looking_match").delete().eq("user_id", user2.user_id);

                    return;
                }
            }
        }
    } 
    catch (error) 
    {
        console.error("Error in findMatch():", error);
    }
}


// Function to calculate the match percentage.
function calculateMatch(user1, user2) 
{
    let score = 0;
    
    if (user1.program === user2.program) score += 30;
    if (user1.study_style === user2.study_style) score += 20;
    if (user1.study_time === user2.study_time) score += 10;
    if (user1.accountability_level === user2.accountability_level) score += 10;
    if (user1.match_university === user2.match_university) score += 30;

    return score;
}



// Function to make a StreamChat Channel for the two users in an active match.
async function createStreamChatChannel(user1Id, user2Id, matchChannelId) 
{
    const client = new StreamChat(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_SECRET_KEY);

    const channel = client.channel("messaging", matchChannelId, 
    {
        members: [user1Id, user2Id],
    });

    try 
    {
        await channel.create({ created_by_id: user1Id });
        return { channel };
    } 
    catch (error) 
    {
        console.error("Error creating chat channel:", error);
        return { error };
    }
}


module.exports = router;
