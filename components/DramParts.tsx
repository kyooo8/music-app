import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ChordContext } from "@/ChordContext";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { ThemedText } from "./ThemedText";

interface Props {
  note: string; // 対象の音階名
  chordIndex: number; // どのコード進行インデックスか
  noteIndex: number; // どの行(9行のうちどれか)か
  dramNotes: string[]; // 使用可能なドラムノートの一覧
}

export const DramParts = ({
  note,
  chordIndex,
  noteIndex,
  dramNotes,
}: Props) => {
  const tab = Colors.dark.tab;
  const tint = Colors.dark.tint;
  const { dram, setDram } = useContext(ChordContext);

  // セルタップ時の処理
  const handleNoteInput = (chordIndex: number, smallNoteIndex: number) => {
    setDram((prevDram) => {
      const updatedDram = prevDram.map((chord) => chord.map((row) => [...row])); // deep copy

      const notePosition = dramNotes.indexOf(note);
      const currentValue = updatedDram[chordIndex][noteIndex][smallNoteIndex];

      // 同じ音がすでに選択されていたら解除、そうでなければ選択
      if (currentValue) {
        updatedDram[chordIndex][noteIndex][smallNoteIndex] = false;
      } else {
        updatedDram[chordIndex][noteIndex][smallNoteIndex] = true;
      }

      return updatedDram;
    });
  };

  const notePosition = dramNotes.indexOf(note);

  return (
    <View style={styles.chordColumn}>
      {Array(4)
        .fill(null)
        .map((_, smallNoteIndex) => {
          const cellKey = `${note}-${chordIndex}-${smallNoteIndex}`;
          const isSelected = dram[chordIndex]?.[noteIndex]?.[smallNoteIndex];

          return (
            <TouchableOpacity
              key={cellKey}
              style={[
                styles.gridCell,
                { backgroundColor: isSelected ? tint : tab },
              ]}
              onPress={() => handleNoteInput(chordIndex, smallNoteIndex)}
            >
              <ThemedText>{note}</ThemedText>
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
    marginRight: lastItemMargin, // グリッド間の余白
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
