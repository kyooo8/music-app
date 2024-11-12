import { StyleSheet, Image, View, useColorScheme } from "react-native";
import { useEffect, useState, useContext } from "react";
import { ChordContext } from "@/ChordContext";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { OctaveCircle } from "@/components/OctaveCircle";
import { ThemedView } from "@/components/ThemedView";
import { ScaleCircle } from "@/components/ScaleCircle";
import { ChordProgression } from "@/components/ChordProgression";
import { ToggleButton } from "@/components/ToggleBtn";
import { Bpm } from "@/components/Bpm";
import { PlayBtn } from "@/components/PlayBtn";

export default function HomeScreen() {
  const { chordProgression, setChordProgression, root, setRoot } =
    useContext(ChordContext);
  const bg = useThemeColor({}, "background");
  const bgCircle = useThemeColor({}, "circle");

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

  const [scaleNotes, setScaleNotes] = useState<string[] | null>(null);
  const [bpm, setBpm] = useState(100);
  const [scaleType, setScaleType] = useState<"メジャー" | "マイナー">(
    "メジャー"
  );

  const handleNoteSelect = (note: string) => {
    setRoot(note);
    const newScaleNotes = caluculateScaleNotes(note, scaleType);
    setScaleNotes(newScaleNotes);
  };

  const caluculateScaleNotes = (
    rootNote: string,
    type: "メジャー" | "マイナー"
  ) => {
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
  }, [scaleType]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.settingContainer}>
        <PlayBtn scaleNotes={scaleNotes} chordProgression={chordProgression} />
        <View style={{ position: "absolute", right: 10 }}>
          <Bpm bpm={bpm} setBpm={setBpm} />
          <ToggleButton scaleType={scaleType} setScaleType={setScaleType} />
        </View>
      </View>
      <ThemedText style={styles.rootText}>ルート：{root}</ThemedText>
      <View style={[styles.circle, { backgroundColor: bgCircle }]}>
        <View style={[styles.innerCircle, { backgroundColor: bg }]} />
        {scaleNotes && <ScaleCircle scaleType={scaleType} />}
        <OctaveCircle
          notes={notes}
          onNoteSelect={handleNoteSelect}
          chordProgression={chordProgression}
          setChordProgression={setChordProgression}
          root={root}
          scaleNotes={scaleNotes}
        />
      </View>
      <ChordProgression
        scaleNotes={scaleNotes}
        chordProgression={chordProgression}
        setChordPorgression={setChordProgression}
      ></ChordProgression>
    </ThemedView>
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
