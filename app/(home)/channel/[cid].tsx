import {View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import {useLocalSearchParams} from "expo-router";
import {Channel as ChannelType} from 'stream-chat'
import {Channel, MessageInput, MessageList, useChatContext} from "stream-chat-expo";
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProviders";
import type { CalendarEntry } from "@/types/calendar";

const Cid = () => {
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const params = useLocalSearchParams<{cid: string; date: string}>();
    const {cid} = params;
    const {client} = useChatContext();
    const { profile } = useAuth();
    const userId = profile?.id;

    // Calendar sidebar state
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(params.date || null);
    const [events, setEvents] = useState<CalendarEntry[]>([]);
    const [tasks, setTasks] = useState<CalendarEntry[]>([]);
    const [newEntryName, setNewEntryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Reference to check if component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        const fetchChannel = async () => {
            const channels = await client.queryChannels({cid});
            setChannel(channels[0]);
        };

        fetchChannel();
        
        // If we have a date parameter, show the sidebar
        if (params.date) {
            setShowSidebar(true);
        }
        
        return () => {
            isMounted.current = false;
        };
    }, [cid]);
    
    // Fetch events and tasks when selectedDate changes
    useEffect(() => {
        if (selectedDate && userId) {
            fetchCalendarData(selectedDate, userId);
        }
    }, [selectedDate, userId]);
    
    // Function to fetch calendar data
    const fetchCalendarData = async (date: string, userId: string) => {
        if (!isMounted.current) return;
        
        try {
            // Extract potential match ID from channel
            let matchId = null;
            if (channel && channel.id) {
                const channelParts = channel.id.split(':');
                if (channelParts.length > 1) {
                    const potentialMatchId = parseInt(channelParts[1]);
                    if (!isNaN(potentialMatchId)) {
                        matchId = potentialMatchId;
                    }
                }
            }
            
            console.log(`Fetching calendar data for date: ${date}, user: ${userId}, match: ${matchId}`);
            
            // Fetch events
            const { data: eventData, error: eventError } = await supabase
                .from("calendars")
                .select("*")
                .eq("date", date)
                .eq("entry_type", "event")
                .eq("user_id", userId);
                
            if (eventError) throw eventError;
            if (isMounted.current) setEvents(eventData || []);
            
            // Fetch tasks
            const { data: taskData, error: taskError } = await supabase
                .from("calendars")
                .select("*")
                .eq("date", date)
                .eq("entry_type", "task")
                .eq("user_id", userId);
                
            if (taskError) throw taskError;
            if (isMounted.current) setTasks(taskData || []);
            
            console.log(`Found ${eventData?.length || 0} events and ${taskData?.length || 0} tasks`);
        } catch (err) {
            console.error("Error fetching calendar data:", err);
            if (isMounted.current) setError("Failed to load calendar data");
        }
    };
    
    // Add a new event or task
    const addEntry = async (name: string, entryType: 'event' | 'task') => {
        if (!name.trim() || !selectedDate || !userId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Extract match ID from channel if available
            let matchId = null;
            if (channel && channel.id) {
                const channelParts = channel.id.split(':');
                if (channelParts.length > 1) {
                    const potentialMatchId = parseInt(channelParts[1]);
                    if (!isNaN(potentialMatchId)) {
                        matchId = potentialMatchId;
                    }
                }
            }
            
            // Create clean insert object
            const insertObj: any = {
                calendar_type: "personal",
                user_id: userId,
                calendar_name: name.trim(),
                date: selectedDate,
                entry_type: entryType
            };
            
            // Only include match_id if valid
            if (typeof matchId === 'number' && !isNaN(matchId)) {
                insertObj.match_id = matchId;
            }
            
            // Clean object of null/undefined values
            Object.keys(insertObj).forEach(key => {
                if (insertObj[key] === null || insertObj[key] === undefined || insertObj[key] === 'null') {
                    delete insertObj[key];
                }
            });
            
            console.log("Inserting new entry:", insertObj);
            
            // Insert into database
            const { data, error: insertError } = await supabase
                .from("calendars")
                .insert([insertObj])
                .select("*");
                
            if (insertError) throw insertError;
            
            console.log("Successfully added entry:", data);
            
            // Refresh calendar data
            fetchCalendarData(selectedDate, userId);
            setNewEntryName('');
        } catch (err) {
            console.error("Failed to add entry:", err);
            if (isMounted.current) setError("Failed to add entry");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };
    
    // Format date for display
    const formatDate = (dateString: string | null) => {
        const dateObj = new Date(dateString || new Date());
        const today = new Date();
        
        const isToday = 
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear();
            
        const options: Intl.DateTimeFormatOptions = {
            month: "long",
            day: "numeric",
            year: "numeric",
        };
        
        const formattedDate = dateObj.toLocaleDateString("en-US", options);
        return isToday ? `Today, ${formattedDate}` : formattedDate;
    };

    if(!channel){
        return <ActivityIndicator />
    }

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 flex-row">
                {/* Main Chat Area */}
                <View className={showSidebar ? "w-3/5" : "flex-1"}>
                    <Channel channel={channel}>
                        <View className="flex-1">
                            <MessageList />
                            <MessageInput />
                        </View>
                    </Channel>
                </View>
                
                {/* Calendar Sidebar */}
                {showSidebar && (
                    <View className="w-2/5 border-l border-gray-200 bg-gray-50">
                        <View className="bg-englishViolet p-3 flex-row justify-between items-center">
                            <Text className="text-white font-bold text-base">
                                {selectedDate ? formatDate(selectedDate) : 'Calendar'}
                            </Text>
                            <TouchableOpacity onPress={() => setShowSidebar(false)}>
                                <Ionicons name="close" size={22} color="white" />
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView className="flex-1 p-3">
                            {!selectedDate ? (
                                <View className="items-center justify-center p-4">
                                    <Text className="text-gray-500 text-center">
                                        No date selected
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    {/* Events Section */}
                                    <View className="mb-5">
                                        <Text className="text-lg font-bold text-gray-800 mb-2">Events</Text>
                                        {events.length > 0 ? (
                                            events.map((event, index) => (
                                                <View key={`event-${index}`} className="flex-row items-center mb-2 bg-white p-2 rounded-md shadow-sm">
                                                    <View style={{ width: 4, height: 16, backgroundColor: '#503E74', marginRight: 10, borderRadius: 2 }} /> 
                                                    <Text className="text-sm text-gray-800 flex-1">{event.calendar_name}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text className="text-sm text-gray-400 italic">No events</Text>
                                        )}
                                    </View>
                                    
                                    {/* Tasks Section */}
                                    <View className="mb-5">
                                        <Text className="text-lg font-bold text-gray-800 mb-2">Tasks</Text>
                                        {tasks.length > 0 ? (
                                            tasks.map((task, index) => (
                                                <View key={`task-${index}`} className="flex-row items-center mb-2 bg-white p-2 rounded-md shadow-sm">
                                                    <View style={{ width: 4, height: 16, backgroundColor: '#503E74', marginRight: 10, borderRadius: 2 }} /> 
                                                    <Text className="text-sm text-gray-800 flex-1">{task.calendar_name}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text className="text-sm text-gray-400 italic">No tasks</Text>
                                        )}
                                    </View>
                                    
                                    {/* Add new entry form */}
                                    <View className="mt-4 bg-white p-3 rounded-md shadow-sm">
                                        <Text className="font-bold text-gray-800 mb-2">Add New</Text>
                                        <TextInput
                                            value={newEntryName}
                                            onChangeText={setNewEntryName}
                                            placeholder="Enter event or task name"
                                            className="border border-gray-300 rounded p-2 mb-2 bg-white text-gray-800"
                                        />
                                        <View className="flex-row gap-2">
                                            <TouchableOpacity
                                                className={`flex-1 bg-englishViolet rounded-lg py-2 px-3 items-center ${!newEntryName.trim() ? 'opacity-50' : ''}`}
                                                disabled={!newEntryName.trim() || loading}
                                                onPress={() => addEntry(newEntryName, 'event')}
                                            >
                                                <Text className="text-white font-medium">Add Event</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className={`flex-1 bg-englishViolet rounded-lg py-2 px-3 items-center ${!newEntryName.trim() ? 'opacity-50' : ''}`}
                                                disabled={!newEntryName.trim() || loading}
                                                onPress={() => addEntry(newEntryName, 'task')}
                                            >
                                                <Text className="text-white font-medium">Add Task</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {loading && <Text className="text-gray-500 text-center mt-2">Adding...</Text>}
                                        {error && <Text className="text-red-500 text-center mt-2">{error}</Text>}
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                )}
                
                {/* Toggle Sidebar Button (only visible when sidebar is hidden) */}
                {!showSidebar && (
                    <TouchableOpacity  
                        className="absolute bottom-20 right-4 bg-englishViolet w-12 h-12 rounded-full items-center justify-center shadow-md"
                        onPress={() => setShowSidebar(true)}
                    >
                        <Ionicons name="calendar" size={22} color="white" />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    )
};

export default Cid
