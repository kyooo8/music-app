import React, { useContext } from "react";
import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Project } from "@/types/project";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LoginContext } from "@/context/LoginContext";

interface Props {
  project: Project;
  onDeleteRequest: (id: string) => void;
}

export const ProjectListItem = (props: Props) => {
  const border = useThemeColor({}, "text");
  const { isLogin } = useContext(LoginContext);
  const { project, onDeleteRequest } = props;
  const { updatedAt } = project;

  if (updatedAt === null) {
    return null;
  }

  let date: Date;

  if (updatedAt instanceof Timestamp) {
    date = updatedAt.toDate();
  } else if (
    typeof updatedAt === "object" &&
    updatedAt !== null &&
    "seconds" in updatedAt &&
    "nanoseconds" in updatedAt
  ) {
    const millis = updatedAt.seconds * 1000 + updatedAt.nanoseconds / 1000000;
    date = new Date(millis);
  } else if (typeof updatedAt === "string") {
    date = new Date(updatedAt);
  } else {
    date = new Date();
  }

  const dateString = date.toLocaleString("ja-JP");

  const handleLongPress = (id: string, title: string) => {
    Alert.alert("削除", `${title}を削除しますか？`, [
      { text: "いいえ" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          if (isLogin) {
            const ref = doc(db, `users/${auth.currentUser?.uid}/projects`, id);
            deleteDoc(ref).catch(() => {
              Alert.alert("削除に失敗しました");
            });
          } else {
            onDeleteRequest(id);
          }
        },
      },
    ]);
  };

  return (
    <>
      <Link
        href={{ pathname: `/(tabs)/chord`, params: { id: project.id } }}
        replace
        asChild
      >
        <TouchableOpacity
          style={styles.musicContainer}
          onLongPress={() =>
            handleLongPress(project.id ? project.id : "", project.title)
          }
        >
          <View style={styles.leftBox}>
            <ThemedText type="subtitle">{project.title}</ThemedText>
            <View>
              <ThemedText>key : {project.root}</ThemedText>
              <ThemedText>BPM : {project.bpm}</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText numberOfLines={2} style={{ marginBottom: 20 }}>
              {dateString}
            </ThemedText>
            <ThemedText>{project.description}</ThemedText>
          </View>
        </TouchableOpacity>
      </Link>
      <View style={[styles.bar, { borderBottomColor: border }]}></View>
    </>
  );
};

const styles = StyleSheet.create({
  musicContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 85,
    width: "100%",
  },
  leftBox: {
    justifyContent: "space-between",
    marginRight: "auto",
  },
  bar: {
    borderBottomWidth: 1,
    marginTop: 4,
    marginBottom: 12,
  },
});
