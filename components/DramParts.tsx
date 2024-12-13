import React, { useContext, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { MusicContext } from "@/MusicContext";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { ThemedText } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  note: string;
  chordIndex: number;
  noteIndex: number;
}

const DramParts = React.memo(({ note, chordIndex, noteIndex }: Props) => {
  const tab = useThemeColor({}, "tab");
  const tint = useThemeColor({}, "tint");
  const { dram, setDram } = useContext(MusicContext);

  const handleNoteInput = useCallback(
    (measure: number, instrument: number, step: number) => {
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
    },
    [setDram]
  );

  return (
    <View style={styles.chordColumn}>
      {Array(8)
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
            ></TouchableOpacity>
          );
        })}
    </View>
  );
});

const styles = StyleSheet.create({
  chordColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: lastItemMargin,
  },
  gridCell: {
    width: cellWidth / 2,
    height: cellheight,
    alignItems: "center",
    justifyContent: "center",
    margin: cellmargin,
    borderRadius: 4,
  },
});

export default DramParts;
