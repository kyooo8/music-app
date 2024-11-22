import { Tabs } from "expo-router";
import { Text } from "react-native";
import { ChordProvider, ChordContext } from "@/ChordContext";
import { Colors } from "@/constants/Colors";
import Icon from "@/components/Icon";

export default function TabLayout() {
  const tint = Colors.dark.tint;
  const tab = Colors.dark.tab;
  const text = Colors.dark.text;
  return (
    <ChordProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: tint,
          headerShown: true,
          tabBarStyle: {
            height: 90,
            backgroundColor: tab,
          },
          headerStyle: {
            backgroundColor: tab,
          },
          headerTitleStyle: {
            color: text,
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
                  const { root } = context;
                  return (
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: focused ? tint : color,
                        fontSize: 20,
                      }}
                    >
                      {root ? root : "C"}
                    </Text>
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
    </ChordProvider>
  );
}
