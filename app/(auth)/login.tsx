import {
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

import { auth } from "@/firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const handlePress = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((usr) => {
      router.replace("/list");
    })
    .catch((e) => {
      alert(e);
    });
};

export default function LoginPage() {
  const bg = Colors.dark.background;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.inner}>
        <ThemedText style={styles.title}>ログイン</ThemedText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email Address"
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
          }}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Password"
          textContentType="password"
        />
        <Button
          title="Submit"
          onPress={() => {
            handlePress(email, password);
          }}
        />
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Not registered?</ThemedText>
          <Link href={"/(auth)/singup"} asChild replace>
            <TouchableOpacity>
              <ThemedText type="link" style={styles.footerLink}>
                Sing up here!
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27,
  },
  input: {
    borderWidth: 1,
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#ffff",
  },
  footer: {
    flexDirection: "row",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
  },
  footerLink: {
    fontSize: 14,
    lineHeight: 24,
  },
});
