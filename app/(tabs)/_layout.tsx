import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Icon from "@/components/Icon";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarStyle: {
          height: 90,
        },
      }}
    >
      <Tabs.Screen
        name="code"
        options={{
          title: "コード",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={"code"} size={48} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="melody"
        options={{
          title: "メロディー",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={"melody"} size={48} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bass"
        options={{
          title: "ベース",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={"bass"} size={48} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dram"
        options={{
          title: "ドラム",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={"dram"} size={48} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
