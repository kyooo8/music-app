import { TouchableOpacity, Alert } from "react-native";
import { signOut } from "firebase/auth";
import React, { useContext } from "react";

import { auth } from "@/firebase/firebaseConfig";
import { router, Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { LoginContext } from "@/context/LoginContext";

export const LogOutButton = (): JSX.Element => {
  const { isLogin } = useContext(LoginContext);
  const handlePress = (): void => {
    Alert.alert("ログアウト", "ロウアウトしますか？", [
      {
        text: "ログアウト",
        style: "destructive",
        onPress: () => {
          signOut(auth)
            .then(() => {
              router.replace("/");
            })
            .catch((error) => {
              Alert.alert(error);
            });
        },
      },
      { text: "戻る", style: "cancel" },
    ]);
  };
  return (
    <>
      {isLogin ? (
        <TouchableOpacity onPress={handlePress}>
          <ThemedText>ログアウト</ThemedText>
        </TouchableOpacity>
      ) : (
        <Link href={"/(auth)/login"} asChild replace>
          <TouchableOpacity>
            <ThemedText>ログイン</ThemedText>
          </TouchableOpacity>
        </Link>
      )}
    </>
  );
};
