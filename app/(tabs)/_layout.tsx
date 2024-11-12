import { Tabs } from "expo-router";
import React, { useState } from "react";
import { ChordProvider, ChordContext } from "@/ChordContext";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Icon from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ChordProvider>
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
          name="chord"
          options={{
            title: "コード",
            tabBarIcon: ({ color, focused }) => (
              <ChordContext.Consumer>
                {(context) => {
                  if (context === null) {
                    return null;
                  }
                  const { root } = context;
                  return <ThemedText>{root}</ThemedText>;
                }}
              </ChordContext.Consumer>
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
    </ChordProvider>
  );
}
