import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db } from "../config";
import { router } from "expo-router";
import { useContext } from "react";
import { ChordContext } from "@/MusicContext";

export default function SaveButton() {
  const { root, bpm, scaleType, chordProgression, melody, bass, dram } =
    useContext(ChordContext);
  console.log("root", root);
  console.log("bpm", bpm);
  console.log("scaleType", scaleType);
  console.log("chordProgression", chordProgression);
  console.log("melody", melody);
  console.log("bass", bass);
  console.log("dram", dram);

  const handlePress = async () => {
    await addDoc(collection(db, `users/${auth.currentUser?.uid}/musics`), {
      root,
      bpm,
      scaleType,
      chordProgression,
      melody,
      bass,
      dram,
      updatedAt: Timestamp.fromDate(new Date()),
    }).catch((error) => {
      console.log("save error", error);
    });
    router.replace("/");
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.text}>保存</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 24,
    color: "rgba(255,255,255,0.7)",
  },
});
