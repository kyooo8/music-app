// MelodyParts.tsx
import { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChordContext } from "@/MusicContext";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { ThemedText } from "./ThemedText";

interface Props {
  note: { name: string; index: number };
  chordIndex: number;
  chordItem: { chord: number; shape: string };
}

export const MelodyParts = ({ note, chordIndex, chordItem }: Props) => {
  const tab = Colors.dark.tab;
  const tint = Colors.dark.tint;
  const { melody, setMelody } = useContext(ChordContext);

  // 音符セルをタップした時の処理
  const handleNoteInput = (measure: number, beat: number) => {
    setMelody((prev) => {
      const oldMelody = prev || {};
      // measureが存在しなければ初期化
      const measureObj = oldMelody[measure] || {};

      const currentNote = measureObj[beat];
      const isSelected = currentNote && currentNote.relativePos === note.index;

      const newNote = isSelected
        ? null
        : { relativePos: note.index, duration: "quarter" };

      const updatedMeasure = { ...measureObj, [beat]: newNote };
      return { ...oldMelody, [measure]: updatedMeasure };
    });
  };

  // メロディは1小節4ビート
  // chordIndexが小節番号にあたる
  // beatは0~3
  return (
    <View style={styles.chordColumn}>
      {Array(4)
        .fill(null)
        .map((_, beat) => {
          const cellKey = `${note.name}-${chordIndex}-${beat}`;
          const currentNote = melody?.[chordIndex]?.[beat];
          const isSelected =
            currentNote && currentNote.relativePos === note.index;
          return (
            <TouchableOpacity
              key={cellKey}
              style={[
                { backgroundColor: isSelected ? tint : tab },
                styles.gridCell,
              ]}
              onPress={() => handleNoteInput(chordIndex, beat)}
            >
              <ThemedText>{note.name}</ThemedText>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  chordColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: lastItemMargin,
  },
  gridCell: {
    width: cellWidth,
    height: cellheight,
    alignItems: "center",
    justifyContent: "center",
    margin: cellmargin,
    borderRadius: 4,
  },
});
