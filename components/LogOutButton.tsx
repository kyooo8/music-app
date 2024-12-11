import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";

import { auth } from "@/firebase/firebaseConfig";
import { router } from "expo-router";

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
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.text}>ログアウト</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 24,
    color: "rgba(255,255,255,0.7)",
  },
});
