import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get("window").width;

type SidebarProps = {
    visible: boolean;
    onClose: () => void;
    events: any[];
    tasks: any[];
};

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, events, tasks }) => {
    const slideAnim = useRef(new Animated.Value(screenWidth)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : screenWidth,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    return (
        <Animated.View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: screenWidth * 0.85,
            height: '100%',
            backgroundColor: '#F7F6FB',
            zIndex: 100,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            transform: [{ translateX: slideAnim }],
        }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#503E74', padding: 16, zIndex: 10 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Calendar</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 16, flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        {/* Events List */}
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Events</Text>
                        {events && events.length > 0 ? (
                            events.map((e, i) => (
                                <View key={i} style={{
                                    backgroundColor: 'white',
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    borderLeftWidth: 4,
                                    borderLeftColor: e.match_id ? '#4CAF50' : '#2196F3'
                                }}>
                                    <Text style={{ fontSize: 16 }}>{e.calendar_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                        {e.match_id ? 'With Buddy' : 'Personal'}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                                        {e.date ? new Date(e.date).toLocaleDateString() : ''}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: '#888', marginBottom: 16 }}>No events</Text>
                        )}
                        {/* Tasks List */}
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 8 }}>Tasks</Text>
                        {tasks && tasks.length > 0 ? (
                            tasks.map((t, i) => (
                                <View key={i} style={{
                                    backgroundColor: 'white',
                                    padding: 12,
                                    borderRadius: 8,
                                    marginBottom: 8,
                                    borderLeftWidth: 4,
                                    borderLeftColor: t.match_id ? '#4CAF50' : '#2196F3'
                                }}>
                                    <Text style={{ fontSize: 16 }}>{t.calendar_name}</Text>
                                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                        {t.match_id ? 'With Buddy' : 'Personal'}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                                        {t.date ? new Date(t.date).toLocaleDateString() : ''}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: '#888' }}>No tasks</Text>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

export default Sidebar;
