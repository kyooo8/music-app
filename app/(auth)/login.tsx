import {
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { auth } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function LoginPage() {
  const tab = useThemeColor({}, "tab");
  const text = useThemeColor({}, "text");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePress = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("ログインしました");
        router.replace("/");
      })
      .catch((e) => {
        alert(e);
      });
  };

  return (
    <ThemedView style={[styles.container]}>
      <View style={styles.inner}>
        <TextInput
          style={[styles.input, { backgroundColor: tab, color: text }]}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="メールアドレス"
          textContentType="emailAddress"
        />
        <TextInput
          style={[styles.input, { backgroundColor: tab, color: text }]}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          autoCapitalize="none"
          secureTextEntry
          placeholder="パスワード"
          textContentType="password"
        />
        <Button
          title="ログイン"
          onPress={() => {
            handlePress(email, password);
          }}
        />
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            まだ登録してませんか？
          </ThemedText>
          <Link href={"/(auth)/singup"} asChild replace>
            <TouchableOpacity>
              <ThemedText type="link" style={styles.footerLink}>
                登録
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    marginTop: "50%",
    paddingVertical: 24,
    paddingHorizontal: 27,
  },
  input: {
    borderWidth: 1,
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    marginTop: 35,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
    marginLeft: "auto",
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
  },
});
