import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { useContext } from "react";
import { MusicContext } from "@/MusicContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export const SaveButton = () => {
  const text = useThemeColor({}, "icon");
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

  // console.log("root", root);
  // console.log("bpm", bpm);
  // console.log("scaleType", scaleType);
  // console.log("chordProgression", chordProgression);
  // console.log("melody", melody);
  // console.log("bass", bass);
  // console.log("dram", dram);

  const handlePress = async () => {
    if (id) {
      const ref = doc(db, `users/${auth.currentUser?.uid}/projects`, id);
      await setDoc(ref, {
        title,
        description,
        root,
        bpm,
        scaleType,
        chordProgression,
        melody,
        bass,
        dram,
        updatedAt: Timestamp.fromDate(new Date()),
      }).catch((e) => {
        console.log("save error", e);
      });
      router.replace("/");
    } else {
      Alert.prompt(
        "保存",
        "タイトルを入力してください",
        [
          {
            text: "キャンセル",
            style: "cancel",
          },
          {
            text: "次へ",
            style: "destructive",
            onPress: async (titleInput: string | undefined) => {
              if (titleInput?.trim() === "") {
                titleInput = "新規プロジェクト";
              }

              Alert.prompt(
                "保存",
                "説明を入力してください",
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "保存する",
                    style: "destructive",
                    onPress: async (descriptionInput: string | undefined) => {
                      try {
                        const ref = await addDoc(
                          collection(
                            db,
                            `users/${auth.currentUser?.uid}/projects`
                          ),
                          {
                            title: titleInput,
                            description: descriptionInput,
                            root,
                            bpm,
                            scaleType,
                            chordProgression,
                            melody,
                            bass,
                            dram,
                            updatedAt: Timestamp.fromDate(new Date()),
                          }
                        );
                        console.log("Document written with ID: ", ref.id);
                        router.replace("/");
                      } catch (error) {
                        console.log("Error adding document: ", error);
                        Alert.alert("保存に失敗しました");
                      }
                    },
                  },
                ],
                "plain-text", // Input type
                "" // Placeholder text for description
              );
            },
          },
        ],
        "plain-text", // Input type
        "" // Placeholder text for title
      );
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.text, { color: text }]}>保存</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginRight: 8,
  },
});
