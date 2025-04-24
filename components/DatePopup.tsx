import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
    visible: boolean;
    date: string;
    position: { top: number; left: number };
    events?: string[];
    tasks?: string[];
    onClose: () => void;
};

const DatePopup = ({ visible, date, position, events = [], tasks = [], onClose }: Props) => {
    if (!visible) return null;

    const readableDate = new Date(date).toDateString();

    return (
        <View style={[styles.popup, position]}>
            <Text style={styles.date}>{readableDate}</Text>

            {events.length > 0 && (
                <>
                    <Text style={styles.section}>Events</Text>
                    {events.map((event, index) => (
                        <Text key={index}>• {event}</Text>
                    ))}
                </>
            )}

            {tasks.length > 0 && (
                <>
                    <Text style={styles.section}>Tasks</Text>
                    {tasks.map((task, index) => (
                        <Text key={index}>• {task}</Text>
                    ))}
                </>
            )}

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    popup: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        width: 200,
        zIndex: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    date: {
        fontWeight: 'bold',
        marginBottom: 6,
    },
    section: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    closeButton: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    closeText: {
        color: 'purple',
    },
});

export default DatePopup;
