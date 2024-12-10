import { StyleSheet, View } from "react-native";
import { useEffect, useContext } from "react";
import { ChordContext, ScaleType } from "@/MusicContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { OctaveCircle } from "@/components/OctaveCircle";
import { ScaleCircle } from "@/components/ScaleCircle";
import { ChordProgression } from "@/components/ChordProgression";
import { ToggleButton } from "@/components/ToggleBtn";
import { Bpm } from "@/components/Bpm";
import { PlayBtn } from "@/components/PlayBtn";

export default function HomeScreen() {
  const { notes, root, setRoot, scaleType, setScaleNotes } =
    useContext(ChordContext);
  const bg = Colors.dark.background;
  const bgCircle = Colors.dark.circle;

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
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.settingContainer}>
        <PlayBtn />
        <View style={{ position: "absolute", right: 10 }}>
          <Bpm />
          <ToggleButton />
        </View>
      </View>
      <ThemedText style={styles.rootText}>
        ルート：{root ? (scaleType === "メジャー" ? root : root + "m") : "なし"}
      </ThemedText>
      <View style={[styles.circle, { backgroundColor: bgCircle }]}>
        <View style={[styles.innerCircle, { backgroundColor: bg }]} />
        <ScaleCircle />
        <OctaveCircle />
      </View>
      <ChordProgression />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  settingContainer: {
    position: "relative",
    width: "100%",
    marginTop: 16,
  },
  rootText: { marginTop: 56 },
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
