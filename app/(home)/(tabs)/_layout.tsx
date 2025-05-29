import React from "react";
import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";

const TabIcon = ({ focused, icon: Icon }: { focused: boolean; icon: any }) => {
  return (
    <View
      className={`${
        focused
          ? "flex flex-row w-full flex-1 min-w-[60px] min-h-16 bg-[#72628B]"
          : "size-full"
      } mt-4 justify-center items-center rounded-lg overflow-hidden`}
    >
      <Icon width={20} height={20} />
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#503E74",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#503E74",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.homeWhite} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.studyRoomWhite} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.settings} />
          ),
        }}
      />
    </Tabs>
  );
};
export default _Layout;
