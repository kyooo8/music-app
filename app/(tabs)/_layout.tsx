import { router, Tabs } from "expo-router";
import React from "react";
import { Icon } from "@/components/Icon";
import { MusicContext, ChordProvider } from "@/context/MusicContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { SaveButton } from "@/components/SaveButton";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { PlayBtn } from "@/components/PlayBtn";

export default function TabLayout() {
  const tint = useThemeColor({}, "tint");
  const tab = useThemeColor({}, "tab");
  const text = useThemeColor({}, "text");
  const bg = useThemeColor({}, "background");

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
            position: "relative",
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
                    <View style={styles.tabIconContainer}>
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
                      ) : null}
                    </View>
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
              <Icon name={"pencil"} size={34} color={focused ? tint : color} />
            ),
          }}
        />
      </Tabs>
      <View
        style={[
          styles.playButtonContainer,
          { backgroundColor: tab, borderColor: bg },
        ]}
      >
        <PlayBtn />
      </View>
    </ChordProvider>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonContainer: {
    position: "absolute",
    bottom: 36,
    left: "50%",
    transform: [{ translateX: -35 }],
    zIndex: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
  },
});
