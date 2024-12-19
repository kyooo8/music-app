import { router, Tabs } from "expo-router";
import React from "react";
import { Icon } from "@/components/Icon";
import { MusicContext, ChordProvider } from "@/context/MusicContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { SaveButton } from "@/components/SaveButton";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  const tint = useThemeColor({}, "tint");
  const tab = useThemeColor({}, "tab");
  const text = useThemeColor({}, "text");
  return (
    <ChordProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tint,
          headerShown: true,
          tabBarStyle: {
            height: 90,
            backgroundColor: tab,
            borderTopWidth: 0,
            borderTopColor: "transparent",
          },
          headerStyle: { backgroundColor: tab },
          headerTitleStyle: { color: text },
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => {
                router.replace("/list");
              }}
            >
              <ThemedText style={{ fontSize: 14 }}>〈 ホーム</ThemedText>
            </TouchableOpacity>
          ),
          headerRight: () => <SaveButton />,
        }}
      >
        <Tabs.Screen
          name="chord"
          options={{
            title: "Circle",
            tabBarIcon: ({ color, focused }) => (
              <MusicContext.Consumer>
                {(context) => {
                  const { root, scaleType } = context;
                  const fontSize =
                    root && scaleType !== "メジャー"
                      ? root.length === 2
                        ? 14
                        : 18
                      : 20;

                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ThemedText
                        style={{
                          fontWeight: "bold",
                          color: focused ? tint : color,
                          fontSize,
                        }}
                      >
                        {root}
                      </ThemedText>
                      {scaleType === "マイナー" ? (
                        <ThemedText
                          style={{
                            fontWeight: "bold",
                            color: focused ? tint : color,
                            fontSize,
                          }}
                        >
                          m
                        </ThemedText>
                      ) : (
                        <></>
                      )}
                    </TouchableOpacity>
                  );
                }}
              </MusicContext.Consumer>
            ),
          }}
        />

        <Tabs.Screen
          name="input"
          options={{
            title: "Note",
            tabBarIcon: ({ color, focused }) => (
              <Icon name={"pencil"} size={28} color={focused ? tint : color} />
            ),
          }}
        />
      </Tabs>
    </ChordProvider>
  );
}
