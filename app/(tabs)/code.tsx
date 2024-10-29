import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  return (
    <View>
      <ThemedText>BPM:120</ThemedText>
      <ThemedText>メジャー</ThemedText>
      <OctaveCircle notes={notes} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
