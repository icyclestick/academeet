import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  CallContent
} from "@stream-io/video-react-native-sdk";
import { useEffect, useState } from "react";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;
const userId = "0a4d77fd-1b7d-4ca8-aca9-58c33c19641e";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGE0ZDc3ZmQtMWI3ZC00Y2E4LWFjYTktNThjMzNjMTk2NDFlIn0.twFRxX9NpJpDb9bNHOPPt7zVmxsnjtW63RggP2Ajh_Y";
const callId = "default_98c61221-511e-4284-b1b9-f01ee1d3bd7a";
const user: User = { id: userId };

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

export default function callScreen() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallContent />
      </StreamCall>
    </StreamVideo>
  );
}