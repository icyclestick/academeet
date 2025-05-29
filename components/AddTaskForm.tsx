import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddTaskFormProps {
  onCancel: () => void;
  onSubmit: (data: {
    taskName: string;
    calendarType: "personal" | "shared" | null;
    deadline: Date;
  }) => void;
  loading?: boolean;
  initialTaskName?: string;
  initialDeadline?: Date;
  initialCalendarType?: "personal" | "shared" | null;
  mode?: "add" | "edit"; // <-- add this
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onCancel,
  onSubmit,
  loading = false,
  initialTaskName = "",
  initialDeadline,
  initialCalendarType = null,
}) => {
  const [taskName, setTaskName] = useState(initialTaskName);
  const [calendarType, setCalendarType] = useState<
    "personal" | "shared" | null
  >(initialCalendarType);
  const [deadline, setDeadline] = useState<Date>(initialDeadline || new Date());
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View className="p-2">
      <Text className="font-bold text-xl text-[#503E74] mb-3">Add Task</Text>
      {/* Task Name */}
      <Text className="font-bold text-base">Task Name:</Text>
      <Input
        placeholder="Enter Task Name"
        value={taskName}
        onChangeText={setTaskName}
        inputStyle={{ fontSize: 14 }}
        containerStyle={{ marginBottom: 8, marginTop: 2, paddingHorizontal: 0 }}
        disabled={loading}
      />

      {/* Sharable Switch */}
      <Text className="font-bold text-base mt-1 mb-2">Sharable?</Text>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-[#503E74] font-medium text-sm">
          {calendarType === "shared" ? "Yes (Shared)" : "No (Personal)"}
        </Text>
        <Switch
          value={calendarType === "shared"}
          onValueChange={(value) =>
            setCalendarType(value ? "shared" : "personal")
          }
          trackColor={{ false: "#bbb", true: "#503E74" }}
          thumbColor={"#fff"}
          ios_backgroundColor="#ccc"
          disabled={loading}
        />
      </View>

      {/* Deadline */}
      <Text className="font-bold text-base">Deadline:</Text>
      <TouchableOpacity
        className="border border-[#503E74] rounded p-2 mt-1 mb-3 flex-row items-center bg-[#f9f6ef]"
        onPress={() => setShowPicker(true)}
        disabled={loading}
      >
        <Text className={deadline ? "text-[#503E74]" : "text-gray-400"}>
          {deadline ? deadline.toLocaleString() : "Select Date & Time"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={deadline || new Date()}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDeadline(selectedDate);
          }}
        />
      )}

      {/* Buttons */}
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity
          onPress={onCancel}
          className="bg-red-500 rounded px-4 py-2 mr-2 flex-row items-center"
          disabled={loading}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text className="text-white font-bold">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSubmit({ taskName, calendarType, deadline })}
          disabled={!taskName || !deadline || loading}
          className={`rounded px-4 py-2 flex-row items-center`}
          style={{
            backgroundColor:
              !taskName || !deadline || loading ? "#b6c2b6" : "#A3AC74",
          }}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={{ marginRight: 4 }}
            />
          ) : (
            <Ionicons
              name="checkmark-done"
              size={18}
              color="white"
              style={{ marginRight: 4 }}
            />
          )}
          <Text className="text-white font-bold">Add Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTaskForm;
