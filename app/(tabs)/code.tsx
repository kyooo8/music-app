import { StyleSheet, View } from "react-native";
import { useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { OctaveCircle } from "@/components/OctaveCircle";

export default function HomeScreen() {
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const [root, setRoot] = useState("C");

  return (
    <View style={styles.container}>
      <ThemedText>BPM:120</ThemedText>
      <ThemedText>メジャー</ThemedText>
      <OctaveCircle notes={notes} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
