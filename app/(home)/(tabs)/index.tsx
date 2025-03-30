import {Image, SafeAreaView, Text, View} from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

export default function Index() {
    interface DateData {
        dateString: string; // "YYYY-MM-DD"
        day: number; // Day of the month
        month: number; // Month (1-12)
        year: number; // Year
        timestamp: number; // Unix timestamp
    }

    return (
    <SafeAreaView className="flex-1 justify-center items-center bg-oldLace gap-4">
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
        <Calendar
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
                        height: 30, // Adjust cell height
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
                textDayFontSize: 14,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
                textMonthFontWeight: 700,
                textDayFontWeight: "bold",
                textDayStyle: { lineHeight: 16 },
                textSectionTitleStyle: { fontSize: 12 },
            }}

            onDayPress={(day: DateData) => {
                console.log('selected day', day);
            }}

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
