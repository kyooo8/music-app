import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { router } from "expo-router";

import { auth, db } from "@/firebase/firebaseConfig";
import { ProjectListItem } from "@/components/ProjectListItem";
import { Project } from "@/types/project";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function ListPage() {
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");

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
    <ThemedView style={styles.container}>
      <ParallaxScrollView>
        {projects.map((project) => (
          <ProjectListItem key={project.id} project={project} />
        ))}
      </ParallaxScrollView>

      <TouchableOpacity
        style={[styles.createBtn, { backgroundColor: tint }]}
        onPress={() => router.replace("/(tabs)/chord")}
      >
        <Text style={[styles.createText]}>+</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createBtn: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    position: "absolute",
    right: 40,
    bottom: 40,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  createText: {
    fontSize: 40,
    lineHeight: 44,
    color: "#ffffff",
  },
});
