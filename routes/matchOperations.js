const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken.js");
const supabase = require("../config/supabaseClient.js");
const { StreamChat } = require("stream-chat");
const process = require("process");
const { serverClient } = require("../config/streamClient");


// Route for updating the match quiz or setting for the first time
router.post("/match-quiz", authenticateToken, async (req, res) => 
{
    const { id } = req.user;
    const { program, year_level, study_time, accountability_level, match_university } = req.body;

    // Check if any of the required fields are missing or empty
    if (!program || !year_level || !study_time || !accountability_level || !match_university) 
    {
        return res.status(400).send({ error: "All fields are required" });
    }

    try 
    {
        // Update the user's match quiz data
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

        // Automatically add the user to the looking_match table with only user_id
        const { error: insertError } = await supabase
            .from("looking_match")
            .insert([{
                user_id: id, 
            }]);

        if (insertError) 
        {
            return res.status(500).send({ error: "Error adding user to looking_match" });
        }

        return res.status(200).send({ success: "Match quiz data saved successfully and user added to looking_match" });

    } 
    catch (error) 
    {
        console.error("Error saving match quiz data:", error);
        return res.status(500).send({ error: "Unexpected error" });
    }
});
    


// Route for adding the user in the looking_match queue. Not yet on UI/UX but might be needed. 
// Should only be used if the user already 
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
// NOTE: PROBABLY NEEDS AN EQUIVALENT GET REQUEST TO CHECK IF THE USER IS IN THE QUEUE?
// No UI/UX for this as of now? Should only be used when the user is in looking_match queue.
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

// Function to run the matching algorithm with and creating a chat with the two.
async function findMatch() {
    try {
        const { data: lookingForMatch, error } = await supabase
            .from("looking_match")
            .select("user_id, created_at")
            .gt("created_at", lastCheckedTime)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching looking for match users:", error);
            return;
        }

        lastCheckedTime = new Date().toISOString();

        for (let i = 0; i < lookingForMatch.length; i++) {
            const user1 = lookingForMatch[i];

            for (let j = i + 1; j < lookingForMatch.length; j++) {
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

                if (user1Error || user2Error) {
                    console.error("Error fetching user details:", user1Error || user2Error);
                    continue;
                }

                const matchScore = calculateMatch(user1Details, user2Details);

                if (matchScore >= 70) {
                    const chatResponse = await createStreamChatChannel(user1.user_id, user2.user_id, matchScore);

                    if (chatResponse.error) {
                        console.error("Error creating chat channel:", chatResponse.error);
                        continue;
                    }

                    await supabase.from("looking_match").delete().eq("user_id", user1.user_id);
                    await supabase.from("looking_match").delete().eq("user_id", user2.user_id);

                    return;
                }
            }
        }
    } 
    catch (error) {
        console.error("Error in findMatch():", error);
    }
}


// Function to calculate the match percentage
// NOTE: THIS FUNCTION SHOULD PROBABLY BE IMPROVED!!
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
async function createStreamChatChannel(userA, userB, matchScore) 
{
  try 
  {
    // Ensure both users are registered on Stream
    await serverClient.upsertUsers([
      { id: userA.id },
      { id: userB.id },
    ]);

    // Create the channel with custom metadata
    const channel = serverClient.channel("messaging", `${userA.id}-${userB.id}`, {
      members: [userA.id, userB.id],
      created_by_id: userA.id,
      is_active: true,
      match_score: matchScore,
    });

    await channel.create();

    // Mark both users as matched in Supabase
    await supabase
      .from("users")
      .update({ is_matched: true })
      .in("id", [userA.id, userB.id]);
  } 
  catch (err) 
  {
    console.error("Failed to create Stream Chat channel:", err);
    throw err;
  }
}

  

// For unmatching a buddy
// NOTE: ASK IF SENDING CHANNEL ID IS POSSIBLE
router.post("/set-chat-inactive", async (req, res) => 
{
    const { channel_id } = req.body;
  
    if (!channel_id) 
    {
      return res.status(400).json({ error: "Missing channel_id" });
    }
  
    try 
    {
      const channel = serverClient.channel("messaging", channel_id);
      await channel.updatePartial({ set: { is_active: false } });
  
      // Fetch channel members
      const channelState = await channel.query({ watch: false, state: true });
      const memberIds = channelState.members.map(m => m.user_id);
  
      // Update each user's is_matched flag
      const { error: updateError } = await supabase
        .from("users")
        .update({ is_matched: false })
        .in("id", memberIds);
  
      if (updateError) 
      {
        console.error("Failed to update user match status:", updateError);
        return res.status(500).json({ error: "Failed to update user match status" });
      }
  
      return res.status(200).json({ message: "Chat marked as inactive and users updated" });
    } 
    catch (err) 
    {
      console.error("Error setting chat inactive:", err);
      return res.status(500).json({ error: "Failed to update chat status" });
    }
});
  


// Route for existing buddy request
router.post("/existing-buddy-request", authenticateToken, async (req, res) => {
    const { buddy_username } = req.body;
    const currentUserId = req.user.id;
  
    try 
    {
      const { data: currentUser, error: currentUserError } = await supabase
        .from("users")
        .select("id, username, is_matched")
        .eq("id", currentUserId)
        .single();
  
      if (currentUserError) 
      {
        return res.status(500).json({ error: "Error fetching current user." });
      }
  
      if (currentUser.is_matched) 
      {
        return res.status(400).json({ error: "You are already matched with someone." });
      }
  
      const { data: buddyUser, error: buddyError } = await supabase
        .from("users")
        .select("id, username, is_matched")
        .eq("username", buddy_username)
        .single();
  
      if (buddyError || !buddyUser) 
      {
        return res.status(404).json({ error: "Buddy not found." });
      }
  
      if (buddyUser.is_matched) 
      {
        return res.status(400).json({ error: "Buddy is already matched with someone." });
      }

      await supabase.from("existing_buddy").insert([
        { requester: currentUser.username, target: buddy_username }
      ]);
  

      const { data: reciprocalMatch } = await supabase
        .from("existing_buddy")
        .select("*")
        .eq("requester", buddy_username)
        .eq("target", currentUser.username)
        .maybeSingle();
  
      if (reciprocalMatch) 
      {
        await supabase.from("looking_match").delete().eq("user_id", currentUserId);
        await supabase.from("looking_match").delete().eq("user_id", buddyUser.id);
  

        await createStreamChatChannel(currentUser, buddyUser, { match_score: 100 });
  

        await supabase.from("users").update({ is_matched: true }).eq("id", currentUserId);
        await supabase.from("users").update({ is_matched: true }).eq("id", buddyUser.id);
  
        return res.json({ message: "Study buddy match successful. Chat channel created." });
      }
  
      res.json({ message: "Request sent. Waiting for buddy to add you back." });
    } 
    catch (err) 
    {
      console.error("Error handling existing buddy match:", err);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  



module.exports = router;
