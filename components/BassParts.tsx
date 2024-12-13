import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { MusicContext } from "@/MusicContext";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MelobassData } from "@/types/music";
interface Props {
  note: { name: string; index: number };
  chordIndex: number;
  chordItem: { chord: number; shape: string };
}

export const BassParts = React.memo(
  ({ note, chordIndex, chordItem }: Props) => {
    const tab = useThemeColor({}, "tab");
    const tint = useThemeColor({}, "tint");
    const { bass, setBass, scaleNotes } = useContext(MusicContext);

    const handleNoteInput = (measure: number, beat: number) => {
      setBass((prev) => {
        const oldBass = prev || {};
        const measureObj = oldBass[measure] || {};
        const currentNote = measureObj[beat];
        const isSelected =
          currentNote && currentNote.relativePos === note.index;

        const newNote = isSelected
          ? null
          : { relativePos: note.index, duration: "quarter" };

        const updatedMeasure = { ...measureObj, [beat]: newNote };
        return { ...oldBass, [measure]: updatedMeasure } as MelobassData;
      });
    };

    const getDisplay = (chord: number) => {
      if (scaleNotes[chord] === note.name) return "ルート";
      switch (scaleNotes.indexOf(note.name) + 1) {
        case 3:
          return "3rd";
        case 5:
          return "5th";
        case 7:
          return "7th";
      }
    };

    return (
      <View style={styles.chordColumn}>
        {Array(4)
          .fill(null)
          .map((_, beat) => {
            const cellKey = `${note.name}-${chordIndex}-${beat}`;
            const currentNote = bass?.[chordIndex]?.[beat];
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
                <ThemedText>{getDisplay(chordItem.chord)}</ThemedText>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  }
);

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
