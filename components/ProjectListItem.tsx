import React from "react";
import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Project } from "@/types/project";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  project: Project;
}

export const ProjectListItem = (props: Props) => {
  const border = useThemeColor({}, "text");
  const { project } = props;
  const { updatedAt } = project;
  if (updatedAt === null) {
    return null;
  }
  const dateString = project.updatedAt.toDate().toLocaleString("ja-JP");

  const handleLongPress = (id: string) => {
    console.log(project.id);

    Alert.alert("オプション", `${project.title}の操作を選択してください`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: () => {
          const ref = doc(db, `users/${auth.currentUser?.uid}/projects`, id);
          Alert.alert("削除します", "よろしいですか？", [
            { text: "いいえ" },
            {
              text: "削除",
              style: "destructive",
              onPress: () => {
                deleteDoc(ref).catch(() => {
                  Alert.alert("削除に失敗しました");
                });
              },
            },
          ]);
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
          onLongPress={() => handleLongPress(project.id)}
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
