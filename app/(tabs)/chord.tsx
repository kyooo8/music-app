import { StyleSheet, View } from "react-native";
import { useEffect, useContext } from "react";

import { ScaleType } from "@/types/music";
import { MusicContext } from "@/MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { OctaveCircle } from "@/components/OctaveCircle";
import { ScaleCircle } from "@/components/ScaleCircle";
import { ChordProgression } from "@/components/ChordProgression";
import { HeaderBottom } from "@/components/HeaderBottom";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const bgCircle = useThemeColor({}, "circle");
  const { notes, root, setRoot, scaleType, setScaleNotes } =
    useContext(MusicContext);

  const handleNoteSelect = (note: string) => {
    setRoot(note);
    const newScaleNotes = caluculateScaleNotes(note, scaleType);
    setScaleNotes(newScaleNotes);
  };

  const caluculateScaleNotes = (rootNote: string, type: ScaleType) => {
    const rootIndex = notes.indexOf(rootNote);
    const sortedNotes = [
      ...notes.slice(rootIndex),
      ...notes.slice(0, rootIndex),
    ];

    let useNotes: string[] = [];

    sortedNotes.forEach((note, index) => {
      let inScaleNotes = [];
      type === "メジャー"
        ? (inScaleNotes = [0, 2, 4, 5, 7, 9, 11])
        : (inScaleNotes = [0, 2, 3, 5, 7, 8, 10]);

      if (inScaleNotes.includes(index)) {
        useNotes.push(note);
      }
    });

    return useNotes;
  };

  useEffect(() => {
    root !== null && handleNoteSelect(root);
  }, [scaleType]);

  useEffect(() => {
    if (root) {
      const newScaleNotes = caluculateScaleNotes(root, scaleType);
      setScaleNotes(newScaleNotes);
    }
  }, [scaleType, root]);

  return (
    <ThemedView style={styles.container}>
      <HeaderBottom />
      <ThemedText>
        ルート：{root ? (scaleType === "メジャー" ? root : root + "m") : "なし"}
      </ThemedText>
      <View style={[styles.circle, { backgroundColor: bgCircle }]}>
        <ThemedView style={styles.innerCircle} />
        <ScaleCircle />
        <OctaveCircle />
      </View>
      <ChordProgression />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  circle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  innerCircle: {
    width: 182,
    height: 182,
    borderRadius: 95,
    position: "absolute",
  },
});
