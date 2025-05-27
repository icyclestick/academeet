import { Dimensions, Image, SafeAreaView, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { useEffect, useState, useCallback } from "react";
import DatePopup from "@/components/DatePopup";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProviders";
import type { CalendarEntry } from "@/types/calendar";

type MarkedDates = { [date: string]: any };

// Fetch all match IDs for the user
async function fetchMatchIds(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("id")
    .or(`user1.eq.${userId},user2.eq.${userId}`);
  if (error) throw error;
  return data ? data.map(row => row.id) : [];
}

// Fetch all events for the user (personal + shared)
async function fetchEvents(userId: string, matchIds: number[]): Promise<CalendarEntry[]> {
  try {
    // Build query for user's personal events
    console.log("Fetching events for user:", userId);
    let query = supabase
      .from("calendars")
      .select("*")
      .eq("user_id", userId);
    
    // Log what we're fetching
    console.log(`Fetching events for user: ${userId}`);
    console.log(`Match IDs available: ${matchIds.length > 0 ? matchIds.join(", ") : "none"}`);
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No events found in database");
      return [];
    }
    
    console.log(`Found ${data.length} events in database`);
    return data;
  } catch (err) {
    console.error("Error in fetchEvents:", err);
    return [];
  }
}

// Add new event or task
async function addEvent({
  calendar_type,
  user_id,
  match_id,
  calendar_name,
  date,
  entry_type,
}: {
  calendar_type: string;
  user_id: string;
  match_id?: number | null;
  calendar_name: string;
  date: string;
  entry_type: 'event' | 'task';
}): Promise<any> {
  try {
    // Create a clean object with only the fields we want
    const insertObj: any = {
      calendar_type,
      user_id, 
      calendar_name,
      date,
      entry_type
    };
    
    // Only include match_id if it's a valid number
    if (typeof match_id === 'number' && !isNaN(match_id)) {
      insertObj.match_id = match_id;
    }
    
    // Extra defense against null/undefined values
    Object.keys(insertObj).forEach(key => {
      if (insertObj[key] === null || insertObj[key] === undefined || insertObj[key] === 'null') {
        delete insertObj[key];
      }
    });
    
    // Log what we're about to insert
    console.log("Clean insert object:", insertObj);
    
    // Insert with .select() to return the inserted row
    const { data, error } = await supabase
      .from("calendars")
      .insert([insertObj])
      .select();
      
    if (error) throw error;
    console.log("Successfully inserted:", data);
    return data;
  } catch (err) {
    console.error("Add entry error:", err);
    throw err;
  }
}

// Transform events to markedDates
function transformEventsToMarkedDates(events: CalendarEntry[], selectedDate: string | null): MarkedDates {
  const marked: MarkedDates = {};
  
  events.forEach((event: CalendarEntry) => {
    if (!event.date) return;
    
    // Normalize date format to YYYY-MM-DD
    const dateStr = event.date.split('T')[0];
    
    if (!marked[dateStr]) {
      marked[dateStr] = {
        customStyles: {
          container: {
            borderBottomWidth: 4,
            borderBottomColor: event.calendar_type === "personal" ? "#503E74" : "#3EA16C",
            backgroundColor: dateStr === selectedDate ? "rgba(80, 62, 116, 0.3)" : "transparent",
            borderRadius: dateStr === selectedDate ? 5 : 0,
          },
          text: {
            fontWeight: "bold",
            color: "#EDE8E2",
          },
        },
      };
    }
  });
  return marked;
}

function Index() {
  const { profile } = useAuth();
  const userId = profile?.id as string | undefined;
  const [matchIds, setMatchIds] = useState<number[]>([]);
  const [events, setEvents] = useState<CalendarEntry[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Fetch matchIds when userId changes
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setIsLoading(true);
      const ids = await fetchMatchIds(userId);
      setMatchIds(ids);
      setIsLoading(false);
    })();
  }, [userId]);

  // Fetch events when userId or matchIds change
  useEffect(() => {
    if (!userId) {
      console.log("No userId available, skipping event fetch");
      setEvents([]);
      return;
    }
    (async () => {
      setIsLoading(true);
      const allEvents = await fetchEvents(userId, matchIds);
      console.log("Fetched events:", allEvents);
      setEvents(allEvents);
      const marked = transformEventsToMarkedDates(allEvents, selectedDate);
      setMarkedDates(marked);
      setIsLoading(false);
    })();
  }, [userId, matchIds]);

  // Debug logs for event filtering
  console.log("All events:", events);
  console.log("Selected date:", selectedDate);

  // Separate events and tasks for the selected date (robust date matching)
  const eventsForDate: CalendarEntry[] = events.filter(ev => 
    ev.date && selectedDate && ev.date.split('T')[0] === selectedDate && ev.entry_type === "event"
  );
  const tasksForDate: CalendarEntry[] = events.filter(ev =>
    ev.date && selectedDate && ev.date.split('T')[0] === selectedDate && ev.entry_type === "task"
  );

  // Log filtered events and tasks for the selected date
  console.log("eventsForDate:", eventsForDate);
  console.log("tasksForDate:", tasksForDate);

  // Handle day press
  const onDayPress = useCallback((day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setShowPopup(true);
    
    // Update marked dates to highlight the selected date
    setMarkedDates(transformEventsToMarkedDates(events, day.dateString));
  }, []);

  // Handle adding a new event or task (personal, for home tab)
  const handleAddPersonalEntry = async (calendar_name: string, entry_type: 'event' | 'task') => {
    let addError = null;
    try {
      await addEvent({
        calendar_type: "personal",
        user_id: userId!, // forced, since personal events only allowed if logged in
        calendar_name,
        date: selectedDate!,
        entry_type
      });
    } catch (err) {
      addError = err;
      console.error("Failed to add event/task:", err);
    } finally {
      // Always refetch events after attempting add
      setIsLoading(true);
      const allEvents = await fetchEvents(userId!, matchIds);
      console.log("Fetched events after add:", allEvents);
      setEvents(allEvents);
      setMarkedDates(transformEventsToMarkedDates(allEvents, selectedDate));
      setIsLoading(false);

      // Close popup
      setShowPopup(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedDate(null);
    setShowPopup(false);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-isabelline gap-4">
      <Image
        source={{ uri: "https://via.placeholder.com/80" }} // Placeholder Image
        className="w-36 h-10 bg-gray-300 rounded-lg self-start ml-6"
        resizeMode="cover"
      />
      <View className="flex-row w-3/4 h-40 bg-olivine rounded-lg items-center justify-center p-3">
        <View className="flex-1">
          <Text className="text-white font-bold text-2xl">Hello, Kurt!</Text>
          <Text className="text-white text-xs">
            Ready to hit the books and meet your perfect study buddy?
          </Text>
        </View>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }} // Placeholder Image
          className="w-24 h-24 bg-gray-300 rounded-lg"
          resizeMode="cover"
        />
      </View>
      {showPopup && (
        <DatePopup
          visible={showPopup}
          date={selectedDate.toString()}
          position={popupPosition}
          events={eventsForDate}
          tasks={tasksForDate}
          onAddEntry={handleAddPersonalEntry}
          onClose={handleClosePopup}
        />
      )}
      <Calendar
        showSixWeeks={true}
        style={{
          backgroundColor: "#96a1b7",
          borderRadius: 10,
          padding: 5,
          height: 320,
          width: 300,
          margin: 0,
        }}
        theme={{
          "stylesheet.day.basic": {
            base: {
              height: 25,
              width: 30,
              alignItems: "center",
              justifyContent: "center",
            },
          },
          calendarBackground: "#96a1b7",
          textSectionTitleColor: "#EDE8E2",
          selectedDayBackgroundColor: "#A3AC74",
          selectedDayTextColor: "#FFFFFF",
          todayTextColor: "#FFFFFF",
          dayTextColor: "#EDE8E2",
          textDisabledColor: "#C7C3BC",
          arrowColor: "#EDE8E2",
          monthTextColor: "#FFFFFF",
          textDayFontSize: 12,
          textMonthFontSize: 14,
          textDayHeaderFontSize: 12,
          textMonthFontWeight: "700",
          textDayFontWeight: "bold",
          textDayStyle: { lineHeight: 16 },
          textSectionTitleStyle: { fontSize: 12 },
        }}
        markingType="custom"
        markedDates={markedDates}
        onDayPress={onDayPress}
      />
      <View className="flex-row space-x-4 mt-4 gap-2">
        <View className="w-44 h-32 bg-jasmine rounded-lg justify-center p-3">
          <View className="flex-row items-center gap-2">
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
              className="w-10 h-10 bg-gray-300 rounded-lg"
              resizeMode="cover"
            />
            <Text className="color-black font-bold">Time</Text>
          </View>
          <Text className="color-black text-xs">
            You focused for 2 hours yesterday! Keep it up! 🎯
          </Text>
        </View>
        <View className="w-44 h-22 bg-jasper rounded-lg justify-center p-3">
          <View className="flex-row items-center gap-2">
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
              className="w-10 h-10 bg-gray-300 rounded-lg"
              resizeMode="cover"
            />
            <Text className="color-white font-bold">Streak</Text>
          </View>
          <Text className="color-white text-xs">
            You’ve hit a 5-day streak! Keep the fire burning! 🔥
          </Text>
        </View>
      </View>
      {/* Loading indicator */}
      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <Text style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Index;
