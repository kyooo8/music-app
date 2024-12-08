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
  note: { name: string; index: number }; // 音符は名前とインデックスを持つオブジェクト
  chordIndex: number;
  thisChordIndex: number;
}

export const BassParts = ({ note, chordIndex, thisChordIndex }: Props) => {
  const tab = Colors.dark.tab;
  const tint = Colors.dark.tint;
  const { bass, setBass, scaleNotes } = useContext(ChordContext);

  const chordRoot = scaleNotes && scaleNotes[thisChordIndex];

  // 音符セルをタップしたときの処理
  const handleNoteInput = (chordIndex: number, noteIndex: number) => {
    setBass((prevBass) => {
      const updatedBass = prevBass.map((row) => [...row]); // 深いコピー
      const currentNoteIndex = updatedBass[chordIndex][noteIndex];

      if (currentNoteIndex === note.index) {
        // 同じセルを再度選択した場合、削除
        updatedBass[chordIndex][noteIndex] = -1;
      } else {
        // 新しい音のインデックスを設定
        updatedBass[chordIndex][noteIndex] = note.index;
      }
      return updatedBass;
    });
  };

  // 音程ラベルを計算
  const getNoteLabel = () => {
    const postion = scaleNotes?.indexOf(note.name);

    if (note.name === chordRoot) return "ルート";
    if (postion === 2) return "3rd";
    if (postion === 4) return "5th";
    if (postion === 6) return "7th";
  };

  return (
    <View style={styles.chordColumn}>
      {Array(4)
        .fill(null)
        .map((_, smallNoteIndex) => {
          const cellKey = `${note.name}-${chordIndex}-${smallNoteIndex}`;
          const isSelected = bass[chordIndex]?.[smallNoteIndex] === note.index;
          return (
            <TouchableOpacity
              key={cellKey}
              style={[
                { backgroundColor: isSelected ? tint : tab },
                styles.gridCell,
              ]}
              onPress={() => handleNoteInput(chordIndex, smallNoteIndex)}
            >
              <ThemedText>{getNoteLabel()}</ThemedText>
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
    marginRight: lastItemMargin, // グリッド間の余白を統一
  },
  gridCell: {
    width: cellWidth, // グリッドセルの幅
    height: cellheight, // グリッドセルの高さ
    alignItems: "center",
    justifyContent: "center",
    margin: cellmargin, // セル間の余白
    borderRadius: 4, // セルに少し角をつける
  },
});