const { StreamChat } = require("stream-chat");

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

if (!STREAM_API_KEY || !STREAM_API_SECRET) 
{
  throw new Error("Missing Stream API credentials in environment variables.");
}

// Initialize Stream server client
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

module.exports = 
{
  serverClient,
};
