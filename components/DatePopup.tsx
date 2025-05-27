import React, { useState } from "react"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Animated, Pressable, ScrollView, TextInput } from "react-native"
import { Ellipsis } from "lucide-react-native"
import type { CalendarEntry } from "@/types/calendar"

// Get screen dimensions and compute popup bounds 
const screenWidth = Dimensions.get("window").width
const screenHeight = Dimensions.get("window").height
const popupWidth = Math.min(261, screenWidth * 0.9)
const popupHeight = Math.min(250, screenHeight * 0.7)
const SCREEN_PADDING = 16 // Minimum distance from screen edges
const DATE_OFFSET = 40 // Minimum distance from the original date position

interface DatePopupProps {
  visible: boolean
  date: string | null
  position: { top: number; left: number }
  events: CalendarEntry[]
  tasks: CalendarEntry[] 
  onAddEntry: (calendar_name: string, entry_type: 'event' | 'task') => Promise<void>
  onClose: () => void
}

const DatePopup: React.FC<DatePopupProps> = ({ visible, date, position, events, tasks, onAddEntry, onClose }) => {
  if (!visible) return null

  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString)
    const today = new Date()

    const isToday =
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    }

    const formattedDate = dateObj.toLocaleDateString("en-US", options)
    return isToday ? `Today, ${formattedDate}` : formattedDate
  }

  // Calculate optimal position to avoid screen bounds and original date
  const calculatePosition = () => {
    let adjustedLeft = position.left
    let adjustedTop = position.top

    // Try to position popup to the right of the date first
    if (position.left + DATE_OFFSET + popupWidth <= screenWidth - SCREEN_PADDING) {
      adjustedLeft = position.left + DATE_OFFSET
    }
    // If not enough space on right, try left
    else if (position.left - DATE_OFFSET - popupWidth >= SCREEN_PADDING) {
      adjustedLeft = position.left - DATE_OFFSET - popupWidth
    }
    // If neither side works, center horizontally with bounds checking
    else {
      adjustedLeft = Math.max(
        SCREEN_PADDING,
        Math.min(screenWidth - popupWidth - SCREEN_PADDING, position.left - popupWidth / 2),
      )
    }

    // Try to position popup below the date first
    if (position.top + DATE_OFFSET + popupHeight <= screenHeight - SCREEN_PADDING) {
      adjustedTop = position.top + DATE_OFFSET
    }
    // If not enough space below, try above
    else if (position.top - DATE_OFFSET - popupHeight >= SCREEN_PADDING) {
      adjustedTop = position.top - DATE_OFFSET - popupHeight
    }
    // If neither works, center vertically with bounds checking
    else {
      adjustedTop = Math.max(
        SCREEN_PADDING,
        Math.min(screenHeight - popupHeight - SCREEN_PADDING, position.top - popupHeight / 2),
      )
    }

    // Final bounds checking to ensure popup stays within screen
    adjustedLeft = Math.max(SCREEN_PADDING, Math.min(adjustedLeft, screenWidth - popupWidth - SCREEN_PADDING))

    adjustedTop = Math.max(SCREEN_PADDING, Math.min(adjustedTop, screenHeight - popupHeight - SCREEN_PADDING))

    return { left: adjustedLeft, top: adjustedTop }
  }

  const adjustedPosition = calculatePosition()

  return (
    <>
      {/* Background overlay */}
      <TouchableOpacity style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.1)", zIndex: 999 }} onPress={onClose} activeOpacity={1} />

      {/* Popup */}
      <View
        style={[
          {
            position: "absolute",
            backgroundColor: "white",
            borderRadius: 15,
            padding: 14,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            overflow: "hidden",
            zIndex: 1000,
            borderWidth: 1,
            borderColor: "#E5E5E5",
          },
          {
            top: adjustedPosition.top,
            left: adjustedPosition.left,
            width: popupWidth,
            height: popupHeight,
          },
        ]}
      >
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base text-gray-500 font-bold flex-1">{formatDate(date as string)}</Text>
          <TouchableOpacity className="p-1 rounded" onPress={onClose}>
            <Ellipsis size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1">
            <View className="mb-5">
              <Text className="text-xl font-bold text-gray-800 mb-3 tracking-wide">EVENTS</Text>
              {events && events.length > 0 ? (
                events.map((event, index) => (
                  <View key={`event-${index}`} className="flex-row items-center mb-2 py-1">
                    <View style={{ width: 4, height: 16, backgroundColor: '#503E74', marginRight: 10, borderRadius: 2 }} />
                    <Text className="text-sm text-gray-800 flex-1 leading-[18px]">{event.calendar_name}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-gray-400 italic ml-3">No events</Text>
              )}
            </View>

            <View className="mb-5">
              <Text className="text-xl font-bold text-gray-800 mb-3 tracking-wide">TASKS</Text>
              {tasks && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <View key={`task-${index}`} className="flex-row items-center mb-2 py-1">
                    <View style={{ width: 4, height: 16, backgroundColor: '#503E74', marginRight: 10, borderRadius: 2 }} />
                    <Text className="text-sm text-gray-800 flex-1 leading-[18px]">{task.calendar_name}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-sm text-gray-400 italic ml-3">No tasks</Text>
              )}
            </View>
          </View>
        </ScrollView>

        {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 4,
    borderRadius: 4,
  },
})

export default DatePopup
