import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import ModalWrapper from "@/components/ModalWrapper";
import AddTaskForm from "@/components/AddTaskForm";
import AddEventForm from "@/components/AddEventForm";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const screenWidth = Dimensions.get("window").width;

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
  userId: string | undefined;
};

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, userId }) => {
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editItem, setEditItem] = useState<CalendarEntry | null>(null);
  const [editType, setEditType] = useState<"event" | "task" | null>(null);

  interface CalendarEntry {
    id: string;
    calendar_name: string;
    date: string;
    match_id: string | null;
  }

  const [events, setEvents] = useState<CalendarEntry[]>([]);
  const [tasks, setTasks] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  interface CalendarItem {
    name: string;
    type: "personal" | "shared" | null;
    date: Date;
    entryType: "task" | "event";
  }

  const handleAddCalendarItem = async ({
    name,
    type,
    date,
    entryType,
  }: CalendarItem) => {
    setLoading(true);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error or user not found", authError);
      setLoading(false);
      return;
    }

    const uid = user.id;
    let matchId: number | null = null;

    if (type === "shared") {
      const { data: matches, error: matchError } = await supabase
        .from("matches")
        .select("id")
        .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)
        .eq("is_active", true);

      if (matchError || !matches || matches.length === 0) {
        console.error("No active match found for shared item", matchError);
        setLoading(false);
        return;
      }

      matchId = matches[0].id;
    }

    const { error: insertError } = await supabase.from("calendars").insert({
      calendar_type: type,
      entry_type: entryType,
      calendar_name: name,
      date: date.toISOString().split("T")[0],
      user_id: uid,
      match_id: matchId,
    });

    if (insertError) {
      console.error("Error inserting calendar item:", insertError);
      setLoading(false);
      return false;
    }

    console.log(`${entryType} added!`);
    await fetchAllCalendarData(uid);
    setLoading(false);
    return true;
  };

  const handleDeleteCalendarItem = async (
    id: string,
    entryType: "event" | "task"
  ) => {
    setLoading(true);
    const { error } = await supabase.from("calendars").delete().eq("id", id);
    if (error) console.error("Error deleting item:", error);
    else if (userId) await fetchAllCalendarData(userId);
    setLoading(false);
  };

  const handleEditCalendarItem = async (
    id: string,
    name: string,
    date: Date,
    entryType: "event" | "task",
    type: "personal" | "shared" | null // <-- add this param
  ) => {
    setEditLoading(true);

    let matchId: number | null = null;
    if (type === "shared" && userId) {
      const { data: matches, error: matchError } = await supabase
        .from("matches")
        .select("id")
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq("is_active", true);

      if (!matchError && matches && matches.length > 0) {
        matchId = matches[0].id;
      }
    }

    const { error } = await supabase
      .from("calendars")
      .update({
        calendar_name: name,
        date: date.toISOString().split("T")[0],
        calendar_type: type,
        match_id: type === "shared" ? matchId : null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating item:", error);
    } else if (userId) {
      await fetchAllCalendarData(userId);
    }
    setEditLoading(false);
    setEditItem(null);
    setEditType(null);
  };

  const fetchAllCalendarData = useCallback(
    async (uid: string) => {
      setRefreshing(true);
      const { data: matches, error: matchError } = await supabase
        .from("matches")
        .select("id")
        .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)
        .eq("is_active", true);

      if (matchError) {
        console.error("Error fetching matches:", matchError);
        setRefreshing(false);
        return;
      }

      const matchIds = matches?.map((m) => m.id).join(",") || "";

      const fetchType = async (type: "event" | "task", setData: Function) => {
        const { data, error } = await supabase
          .from("calendars")
          .select("id, calendar_name, date, match_id")
          .eq("entry_type", type)
          .or(`user_id.eq.${uid},match_id.in.(${matchIds})`);
        if (error) console.error(`Error fetching ${type}s:`, error);
        else setData(data || []);
      };

      await Promise.all([
        fetchType("event", setEvents),
        fetchType("task", setTasks),
      ]);

      setRefreshing(false);
    },
    [setEvents, setTasks]
  );

  useEffect(() => {
    if (userId) fetchAllCalendarData(userId);
  }, [userId]);

  const onRefresh = () => {
    if (userId) fetchAllCalendarData(userId);
  };

  const renderRightActions = (id: string, entryType: "event" | "task") => (
    <TouchableOpacity
      style={{
        backgroundColor: "#e74c3c",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: "100%",
        borderRadius: 8,
      }}
      onPress={() => handleDeleteCalendarItem(id, entryType)}
    >
      <Ionicons name="trash" size={24} color="white" />
      <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: screenWidth * 0.85,
        height: "100%",
        backgroundColor: "#F7F6FB",
        zIndex: 100,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#503E74",
            padding: 16,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            Task Tracker
          </Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={onRefresh}>
              <Ionicons name="refresh" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Modals */}
        <ModalWrapper
          visible={showAddTask}
          onClose={() => setShowAddTask(false)}
        >
          <AddTaskForm
            key={editItem?.id}
            onSubmit={async (data) => {
              setLoading(true);
              const success = await handleAddCalendarItem({
                name: data.taskName,
                type: data.calendarType,
                date: data.deadline,
                entryType: "task",
              });
              setLoading(false);
              if (success) setShowAddTask(false);
            }}
            onCancel={() => setShowAddTask(false)}
            loading={loading}
          />
        </ModalWrapper>

        <ModalWrapper
          visible={showAddEvent}
          onClose={() => setShowAddEvent(false)}
        >
          <AddEventForm
            onSubmit={async (data) => {
              setLoading(true);
              const success = await handleAddCalendarItem({
                name: data.eventName,
                type: data.calendarType,
                date: data.eventDate,
                entryType: "event",
              });
              setLoading(false);
              if (success) setShowAddEvent(false);
            }}
            onCancel={() => setShowAddEvent(false)}
            loading={loading}
          />
        </ModalWrapper>

        {/* Scroll content */}
        <View className="p-4 flex-1">
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
              Events
            </Text>
            {editItem && editType === "task" && (
              <ModalWrapper
                visible={true}
                onClose={() => {
                  setEditItem(null);
                  setEditLoading(false);
                }}
              >
                <AddTaskForm
                  key={editItem?.id}
                  onSubmit={async (data) => {
                    setEditLoading(true);
                    await handleEditCalendarItem(
                      editItem.id,
                      data.taskName,
                      data.deadline,
                      "task",
                      data.calendarType
                    );
                    setEditLoading(false);
                  }}
                  onCancel={() => setEditItem(null)}
                  loading={editLoading}
                  // Pre-fill values
                  initialTaskName={editItem.calendar_name}
                  initialDeadline={new Date(editItem.date)}
                  initialCalendarType={
                    editItem.match_id ? "shared" : "personal"
                  }
                  mode="edit"
                />
              </ModalWrapper>
            )}
            {editItem && editType === "event" && (
              <ModalWrapper
                visible={true}
                onClose={() => {
                  setEditItem(null);
                  setEditLoading(false);
                }}
              >
                <AddEventForm
                  onSubmit={async (data) => {
                    setEditLoading(true);
                    await handleEditCalendarItem(
                      editItem.id,
                      data.eventName,
                      data.eventDate,
                      "event",
                      data.calendarType
                    );
                  }}
                  onCancel={() => setEditItem(null)}
                  loading={editLoading}
                  // Pre-fill values
                  initialEventName={editItem.calendar_name}
                  initialEventDate={new Date(editItem.date)}
                  initialCalendarType={
                    editItem.match_id ? "shared" : "personal"
                  }
                  mode="edit"
                />
              </ModalWrapper>
            )}
            {events.length > 0 ? (
              events.map((e) => (
                <Swipeable
                  key={e.id}
                  renderRightActions={() => renderRightActions(e.id, "event")}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setEditItem(e);
                      setEditType("event");
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: e.match_id ? "#4CAF50" : "#2196F3",
                        marginLeft: 14,
                      }}
                    >
                      <Text>{e.calendar_name}</Text>
                      <Text style={{ color: "#888" }}>
                        {e.match_id ? "With Buddy" : "Personal"}
                      </Text>
                      <Text style={{ color: "#666" }}>
                        {e.date ? new Date(e.date).toLocaleDateString() : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              <Text style={{ color: "#888", marginBottom: 16 }}>No events</Text>
            )}

            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginVertical: 8 }}
            >
              Tasks
            </Text>
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <Swipeable
                  key={t.id}
                  renderRightActions={() => renderRightActions(t.id, "task")}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setEditItem(t);
                      setEditType("task");
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: t.match_id ? "#4CAF50" : "#2196F3",
                        marginLeft: 14,
                      }}
                    >
                      <Text>{t.calendar_name}</Text>
                      <Text style={{ color: "#888" }}>
                        {t.match_id ? "With Buddy" : "Personal"}
                      </Text>
                      <Text style={{ color: "#666" }}>
                        {t.date ? new Date(t.date).toLocaleDateString() : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))
            ) : (
              <Text style={{ color: "#888", marginBottom: 16 }}>No tasks</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default Sidebar;
