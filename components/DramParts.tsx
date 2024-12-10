// DramParts.tsx
import React, { useContext } from "react";
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
  note: string;
  chordIndex: number; // measure
  noteIndex: number; // instrument index
  dramNotes: string[];
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

  // ドラムは1小節16ステップ
  // dram: { [measure: number]: { [instrument: number]: { [step: number]: boolean } } }
  // instrument = noteIndex
  // steps: 0~15

  const handleNoteInput = (
    measure: number,
    instrument: number,
    step: number
  ) => {
    setDram((prev) => {
      const oldDram = prev || {};
      const measureObj = oldDram[measure] || {};
      const instrumentObj = measureObj[instrument] || {};
      const current = instrumentObj[step] || false;
      const newVal = !current;

      return {
        ...oldDram,
        [measure]: {
          ...measureObj,
          [instrument]: {
            ...instrumentObj,
            [step]: newVal,
          },
        },
      };
    });
  };

  return (
    <View style={styles.chordColumn}>
      {Array(16)
        .fill(null)
        .map((_, step) => {
          const cellKey = `${note}-${chordIndex}-${noteIndex}-${step}`;
          const isSelected = dram?.[chordIndex]?.[noteIndex]?.[step] || false;
          return (
            <TouchableOpacity
              key={cellKey}
              style={[
                styles.gridCell,
                { backgroundColor: isSelected ? tint : tab },
              ]}
              onPress={() => handleNoteInput(chordIndex, noteIndex, step)}
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
