import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddTaskFormProps {
    onCancel: () => void;
    onSubmit: (data: { taskName: string; calendarType: 'personal' | 'shared'; deadline: Date }) => void;
    loading?: boolean;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onCancel, onSubmit, loading = false }) => {
    const [taskName, setTaskName] = useState('');
    const [calendarType, setCalendarType] = useState<'personal' | 'shared' | null>(null);
    const [deadline, setDeadline] = useState<Date | null>(null);
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

            {/* Personal/Sharable */}
            <Text className="font-bold text-base mt-1">Type:</Text>
            <View className="flex-row items-center mb-2 mt-1">
                <TouchableOpacity
                    className="flex-row items-center mr-6"
                    onPress={() => setCalendarType(calendarType === 'personal' ? null : 'personal')}
                    disabled={loading}
                >
                    <View className={`w-5 h-5 rounded border-2 border-[#503E74] mr-1 ${calendarType === 'personal' ? 'bg-[#503E74]' : ''}`} />
                    <Text className="text-sm text-[#503E74]">Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => setCalendarType(calendarType === 'shared' ? null : 'shared')}
                    disabled={loading}
                >
                    <View className={`w-5 h-5 rounded border-2 border-[#503E74] mr-1 ${calendarType === 'shared' ? 'bg-[#503E74]' : ''}`} />
                    <Text className="text-sm text-[#503E74]">Sharable</Text>
                </TouchableOpacity>
            </View>

            {/* Deadline */}
            <Text className="font-bold text-base">Deadline:</Text>
            <TouchableOpacity
                className="border border-[#503E74] rounded p-2 mt-1 mb-3 flex-row items-center bg-[#f9f6ef]"
                onPress={() => setShowPicker(true)}
                disabled={loading}
            >
                <Text className={deadline ? 'text-[#503E74]' : 'text-gray-400'}>
                    {deadline ? deadline.toLocaleString() : 'Select Date & Time'}
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
                    className="bg-[#d9534f] rounded px-4 py-2 mr-2 flex-row items-center"
                    disabled={loading}
                >
                    <Ionicons name="arrow-back" size={18} color="white" style={{ marginRight: 4 }} />
                    <Text className="text-white font-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onSubmit({ taskName, calendarType, deadline })}
                    disabled={!taskName || !calendarType || !deadline || loading}
                    className={`rounded px-4 py-2 flex-row items-center ${!taskName || !calendarType || !deadline || loading ? 'bg-[#b6c2b6]' : 'bg-[#A3AC74]'}`}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" style={{ marginRight: 4 }} />
                    ) : (
                        <Ionicons name="checkmark-done" size={18} color="white" style={{ marginRight: 4 }} />
                    )}
                    <Text className="text-white font-bold">Add Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddTaskForm;
