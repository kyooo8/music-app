import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { ProjecctListItem } from "@/components/ProjectListItem";
import { Project } from "@/types/project";

export default function ListPage() {
  const [projects, setprojects] = useState<Project[]>([]);

  useEffect(() => {
    const ref = collection(db, `users/${auth.currentUser?.uid}/projects`);
    const q = query(ref, orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const remoteProjects: Project[] = [];
      snapShot.forEach((doc) => {
        const { title, description, root, bpm, scaleType, updatedAt } =
          doc.data();
        remoteProjects.push({
          id: doc.id,
          title,
          description,
          root,
          bpm,
          scaleType,
          updatedAt,
        });
      });
      setprojects(remoteProjects);
    });
    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={projects}
          renderItem={({ item }) => <ProjecctListItem project={item} />}
        />
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.replace("/(tabs)/chord")}
        >
          <ThemedText type="title">+</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    flex: 1,
  },
  listContainer: {
    marginTop: 30,
    flex: 1,
    width: "80%",
    marginInline: "auto",
  },
  createBtn: {
    backgroundColor: Colors.dark.tint,
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    position: "absolute",
    right: 40,
    bottom: 40,
  },
});
