import React, { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { auth, db } from "@/firebase/firebaseConfig";
import { ProjectListItem } from "@/components/ProjectListItem";
import { Project } from "@/types/project";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LoginContext } from "@/context/LoginContext";
import { ThemedText } from "@/components/ThemedText";

export default function ListPage() {
  const tint = useThemeColor({}, "tint");
  const { isLogin } = useContext(LoginContext);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleDeleteProject = async (id: string) => {
    const storedData = await AsyncStorage.getItem("projects");
    const projectsArray = storedData ? JSON.parse(storedData) : [];
    const filteredProjects = projectsArray.filter((p: Project) => p.id !== id);
    await AsyncStorage.setItem("projects", JSON.stringify(filteredProjects));

    setProjects(filteredProjects);
  };

  const fetchProjectsFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem("projects");
      const localProjects: Project[] = storedData ? JSON.parse(storedData) : [];
      setProjects(localProjects);
    } catch (error) {
      console.error("AsyncStorage取得エラー:", error);
    }
  };

  const fetchProjectsFromFirestore = () => {
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
      setProjects(remoteProjects);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (isLogin) {
      const unsubscribe = fetchProjectsFromFirestore();
      return () => unsubscribe();
    } else {
      fetchProjectsFromAsyncStorage();
    }
  }, [isLogin]);

  return (
    <ThemedView style={styles.container}>
      {projects.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {isLogin ? (
            <ThemedText>プロジェクトを作成しましょう </ThemedText>
          ) : (
            <>
              <ThemedText style={{ marginBottom: 10 }}>
                アカウントが見つかりません
              </ThemedText>
              <ThemedText>2つまでプロジェクトを保存できます</ThemedText>
            </>
          )}
        </View>
      ) : (
        <ParallaxScrollView>
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onDeleteRequest={handleDeleteProject}
            />
          ))}
        </ParallaxScrollView>
      )}
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
