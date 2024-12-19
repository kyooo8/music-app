import { TouchableOpacity, Alert } from "react-native";
import { doc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { useContext } from "react";
import { MusicContext } from "@/context/MusicContext";
import { ThemedText } from "./ThemedText";
import { v4 as uuidv4 } from "uuid";
import { LoginContext } from "@/context/LoginContext";
import { Project } from "@/types/project";

export const SaveButton = () => {
  const {
    id,
    title,
    description,
    root,
    bpm,
    scaleType,
    chordProgression,
    melody,
    bass,
    dram,
  } = useContext(MusicContext);
  const { isLogin } = useContext(LoginContext);

  const saveToAsyncStorage = async (id: string, data: Project) => {
    try {
      const storedData = await AsyncStorage.getItem("projects");
      const projects = storedData ? JSON.parse(storedData) : [];

      if (projects.length <= 2) {
        const updatedProjects = projects.map((project: Project) =>
          project.id === id ? { ...project, ...data } : project
        );

        await AsyncStorage.setItem("projects", JSON.stringify(updatedProjects));
        Alert.alert("保存しました");
        router.replace("/list");
      } else {
        Alert.alert(
          "ログインしていません",
          "保存できるプロジェクトは2つまでです"
        );
      }
    } catch (error) {
      console.error("AsyncStorage save error:", error);
      Alert.alert("エラー", "保存に失敗しました", [{ text: "OK" }]);
    }
  };

  const createToAsyncStorage = async (
    titleInput: string | undefined,
    descriptionInput: string | undefined,
    projectData: Project
  ) => {
    try {
      const dataWithId = { ...projectData, id: uuidv4() };
      const storedData = await AsyncStorage.getItem("projects");
      const projects = storedData ? JSON.parse(storedData) : [];
      if (projects.length <= 2) {
        const isDuplicate = projects.some(
          (project: Project) => project.id === dataWithId.id
        );

        if (!isDuplicate) {
          const localData = {
            ...dataWithId,
            title: titleInput,
            description: descriptionInput,
          };
          projects.push(localData);
          await AsyncStorage.setItem("projects", JSON.stringify(projects));
          Alert.alert("作成しました");
          router.replace("/list");
        } else {
          console.warn("重複するIDが見つかりました。再試行します。");
          await createToAsyncStorage(titleInput, descriptionInput, projectData);
        }
      } else {
        Alert.alert(
          "アカウントが見つかりません",
          "保存できるプロジェクトは2つまでです"
        );
      }
    } catch (error) {
      console.error("AsyncStorage save error:", error);
      Alert.alert("エラー", "ローカルストレージへの作成に失敗しました", [
        { text: "OK" },
      ]);
    }
  };

  const saveToFirestore = async (id: string, projectData: Project) => {
    const ref = doc(db, `users/${auth.currentUser?.uid}/projects`, id);
    await setDoc(ref, projectData).catch((e) => {
      console.log("Firebase save error", e);
      Alert.alert("エラー", "保存に失敗しました", [{ text: "OK" }]);
    });
    Alert.alert("保存しました");
    router.replace("/list");
  };

  const createToFirestore = async (
    titleInput: string | undefined,
    descriptionInput: string | undefined,
    projectData: Project
  ) => {
    try {
      const ref = await addDoc(
        collection(db, `users/${auth.currentUser?.uid}/projects`),
        {
          ...projectData,
          title: titleInput,
          description: descriptionInput,
        }
      );
      Alert.alert("作成しました");
      router.replace("/list");
    } catch (error) {
      console.log("Error adding document: ", error);
      Alert.alert("保存に失敗しました");
    }
  };

  const handlePress = async () => {
    const projectData: Project = {
      title: title || "新規プロジェクト",
      description: description || "",
      root,
      bpm,
      scaleType,
      chordProgression,
      melody,
      bass,
      dram,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (id) {
      if (isLogin) {
        saveToFirestore(id, projectData);
      } else {
        await saveToAsyncStorage(id, projectData);
      }
    } else {
      Alert.prompt(
        "新規作成",
        "タイトルを入力してください",
        [
          {
            text: "次へ",
            style: "default",
            onPress: async (titleInput) => {
              if (titleInput?.trim() === "") {
                titleInput = "新規プロジェクト";
              }
              Alert.prompt(
                "新規作成",
                "説明を入力してください",
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "作成する",
                    style: "default",
                    onPress: async (descriptionInput) => {
                      if (id) {
                        createToFirestore(
                          titleInput,
                          descriptionInput,
                          projectData
                        );
                      } else {
                        await createToAsyncStorage(
                          titleInput,
                          descriptionInput,
                          projectData
                        );
                      }
                    },
                  },
                ],
                "plain-text",
                ""
              );
            },
          },
          {
            text: "キャンセル",
            style: "cancel",
          },
        ],
        "plain-text",
        ""
      );
    }
  };

  return (
    <TouchableOpacity style={{ marginRight: 15 }} onPress={handlePress}>
      <ThemedText>{id ? "保存" : "作成"}</ThemedText>
    </TouchableOpacity>
  );
};
