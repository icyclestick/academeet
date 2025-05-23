import { Dimensions, Image, SafeAreaView, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import { useState } from "react";
import DatePopup from "@/components/DatePopup";

const { width } = Dimensions.get('window');

export default function Index() {
    interface DateData {
        dateString: string; // "YYYY-MM-DD"
        day: number; // Day of the month
        month: number; // Month (1-12)
        year: number; // Year
        timestamp: number; // Unix timestamp
    }

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // Mock data for demonstration
    const mockData: { [key: string]: { events: string[]; tasks: string[] } } = {
        '2025-03-01': {
            events: ['New Year’s Day', 'Shift Out Onboarding'],
            tasks: ['Study Session with Kurt', 'DesAlgo Project Proposal', 'Review for Departmentals'],
        },
        // Add more dates and their corresponding events and tasks here
    };

    const handleDayLongPress = (day: { dateString: string; day: number; month: number; year: number }) => {
        const firstDayOfMonth = new Date(day.year, day.month - 1, 1);
        const firstDayWeekday = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
        const dateIndex = firstDayWeekday + (day.day - 1);
        const row = Math.floor(dateIndex / 7);
        const column = dateIndex % 7;

        const cellWidth = 30; // Adjust based on your calendar's cell width
        const cellHeight = 30; // Adjust based on your calendar's cell height
        const calendarX = 20; // X position of the calendar on the screen
        const calendarY = 100; // Y position of the calendar on the screen

        const left = calendarX + column * cellWidth;
        const top = calendarY + row * cellHeight;

        setSelectedDate(day.dateString);
        setPopupPosition({ top, left });
    };

    const handleClosePopup = () => {
        setSelectedDate(null);
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
            {selectedDate && (
                <DatePopup
                    visible={true}
                    date={selectedDate}
                    position={popupPosition}
                    events={mockData[selectedDate]?.events}
                    tasks={mockData[selectedDate]?.tasks}
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
                            height: 25, // Adjust cell height
                            width: 30,  // Adjust cell width
                            alignItems: "center",
                            justifyContent: "center",
                        },
                    },
                    calendarBackground: "#96a1b7",
                    textSectionTitleColor: "#EDE8E2", // Light text for month/weekdays
                    selectedDayBackgroundColor: "#A3AC74", // Greenish selection
                    selectedDayTextColor: "#FFFFFF",
                    todayTextColor: "#FFFFFF",
                    dayTextColor: "#EDE8E2",
                    textDisabledColor: "#C7C3BC", // Faded color for disabled days
                    arrowColor: "#EDE8E2", // White arrows
                    monthTextColor: "#FFFFFF",
                    textDayFontSize: 12, // try adjusting to fit inside current setup
                    textMonthFontSize: 14, // try adjusting to fit inside current setup
                    textDayHeaderFontSize: 12, // try adjusting to fit inside current setup
                    textMonthFontWeight: "700",
                    textDayFontWeight: "bold",
                    textDayStyle: { lineHeight: 16 },
                    textSectionTitleStyle: { fontSize: 12 },
                }}
                onDayPress={(day: DateData) => {
                    console.log('selected day', day);
                }}
                onDayLongPress={handleDayLongPress}
            />
            <View className="flex-row space-x-4 mt-4 gap-2">
                <View className="w-44 h-32 bg-jasmine rounded-lg justify-center p-3">
                    <View className="flex-row items-center gap-2">
                        <Image
                            source={{ uri: "https://via.placeholder.com/80" }} // Placeholder Image
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
                            source={{ uri: "https://via.placeholder.com/80" }} // Placeholder Image
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
        </SafeAreaView>
    );
}
