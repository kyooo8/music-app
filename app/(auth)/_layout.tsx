import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: "none" },
        headerShown: true,
        headerStyle: { backgroundColor: bg },
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
