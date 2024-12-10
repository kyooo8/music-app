import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ChordContext } from "@/MusicContext";
import Icon from "@/components/Icon";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const tint = Colors.dark.tint;
  const tab = Colors.dark.tab;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: false,
        tabBarStyle: {
          height: 90,
          backgroundColor: tab,
          borderTopWidth: 0,
          borderTopColor: "transparent",
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
                const { root, scaleType } = context; // ChordContextからrootとscaleTypeを取得

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
            </ChordContext.Consumer>
          ),
        }}
      />

      <Tabs.Screen
        name="melody"
        options={{
          title: "メロディー",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={"melody"} size={28} color={focused ? tint : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bass"
        options={{
          title: "ベース",
          tabBarIcon: ({ color, focused }) => (
            <Icon name={"bass"} size={28} color={focused ? tint : color} />
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
  );
}
