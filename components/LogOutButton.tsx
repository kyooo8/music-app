import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";

import { auth } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

const handlePress = (): void => {
  signOut(auth)
    .then(() => {
      router.replace("/(auth)/login");
    })
    .catch((error) => {
      Alert.alert(error);
    });
};

export const LogOutButton = (): JSX.Element => {
  const text = useThemeColor({}, "icon");
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.text, { color: text }]}>ログアウト</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 24,
  },
});
