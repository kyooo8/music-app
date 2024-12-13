import { Tabs } from "expo-router";

import { Icon } from "@/components/Icon";
import { MusicContext, ChordProvider } from "@/MusicContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { SaveButton } from "@/components/SaveButton";

export default function TabLayout() {
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
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
          headerStyle: { backgroundColor: bg },
          headerTitleStyle: { color: text },
          headerTitleAlign: "left",
          headerRight: () => <SaveButton />,
        }}
      >
        <Tabs.Screen
          name="chord"
          options={{
            title: "コード",
            tabBarIcon: ({ color, focused }) => (
              <MusicContext.Consumer>
                {(context) => {
                  const { root, scaleType } = context; // MusicContextからrootとscaleTypeを取得

                  // mが表示される場合にフォントサイズを調整
                  const fontSize =
                    root && scaleType !== "メジャー"
                      ? root.length === 2
                        ? 14
                        : 18
                      : 20;

                  return (
                    <ThemedText
                      style={{
                        fontWeight: "bold",
                        color: focused ? tint : color,
                        fontSize, // フォントサイズを変更
                      }}
                    >
                      {root
                        ? scaleType === "メジャー"
                          ? root
                          : root + "m"
                        : "C"}
                    </ThemedText>
                  );
                }}
              </MusicContext.Consumer>
            ),
          }}
        />

        <Tabs.Screen
          name="melobass"
          options={{
            title: "メロディー・ベース",
            tabBarIcon: ({ color, focused }) => (
              <Icon name={"melody"} size={28} color={focused ? tint : color} />
            ),
          }}
        />

        <Tabs.Screen
          name="dram"
          options={{
            title: "ドラム",
            tabBarIcon: ({ color, focused }) => (
              <Icon name={"dram"} size={28} color={focused ? tint : color} />
            ),
          }}
        />
      </Tabs>
    </ChordProvider>
  );
}
