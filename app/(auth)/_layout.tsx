import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const tab = useThemeColor({}, "tab");
  const text = useThemeColor({}, "text");
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
        headerShown: true,
        headerStyle: { backgroundColor: tab },
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
      }}
    >
      <Tabs.Screen
        name="login"
        options={{
          title: "ログイン",
          headerTitleStyle: { color: text },
        }}
      />

      <Tabs.Screen
        name="singup"
        options={{
          title: "新規登録",
          headerTitleStyle: { color: text },
        }}
      />
    </Tabs>
  );
}
