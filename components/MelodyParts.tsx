import React, { useContext, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MusicContext } from "@/context/MusicContext";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { Audio } from "expo-av";
import { ThemedText } from "./ThemedText";
import { MelobassData } from "@/types/music";
import { useThemeColor } from "@/hooks/useThemeColor";
import { fadeOutSound, getOctaveAdjustedNote } from "@/hooks/playMusicLogic";
import { melodySoundsMap } from "@/constants/soundMaps";

const sound = new Audio.Sound();

interface Props {
  note: { name: string; index: number };
  chordIndex: number;
  chordItem: { chord: number; shape: string };
}

export const MelodyParts = React.memo(
  ({ note, chordIndex, chordItem }: Props) => {
    const tab = useThemeColor({}, "tab");
    const tint = useThemeColor({}, "melody");
    const { melody, setMelody, scaleNotes, bass, sortedMelodyNotes } =
      useContext(MusicContext);
    const sound = new Audio.Sound();

    const objectSortedMelodyNotes = Object.fromEntries(
      sortedMelodyNotes.map((n, i) => [i, n])
    );
    const playSound = async (relativePos: number, note: string) => {
      const fullName = getOctaveAdjustedNote(
        note,
        relativePos,
        false,
        objectSortedMelodyNotes
      );
      try {
        console.log(fullName);

        const soundFile = melodySoundsMap[fullName];
        await sound.loadAsync(soundFile);
        await sound.playAsync();
        setTimeout(async () => {
          await fadeOutSound(sound, 300);
        }, 800);
      } catch (error) {
        console.error("音声再生エラー:", error);
      }
    };

    const handleNoteInput = useCallback(
      (measure: number, beat: number) => {
        setMelody((prev) => {
          const oldMelody = prev || {};

          const measureObj = oldMelody[measure] || {};

          const currentNote = measureObj[beat];
          const isSelected =
            currentNote && currentNote.relativePos === note.index;

          const newNote = isSelected
            ? null
            : { relativePos: note.index, duration: "quarter" };

          const updatedMeasure = { ...measureObj, [beat]: newNote };
          return { ...oldMelody, [measure]: updatedMeasure } as MelobassData;
        });
      },
      [setMelody, note.index]
    );

    const getDisplay = useCallback(
      (chord: number) => {
        if (scaleNotes[chord] === note.name) return "ルート";
        switch (scaleNotes.indexOf(note.name) + 1) {
          case 3:
            return "3rd";
          case 5:
            return "5th";
          case 7:
            return "7th";
          default:
            return "";
        }
      },
      [scaleNotes, note.name]
    );

    return (
      <View style={styles.chordColumn}>
        {Array(4)
          .fill(null)
          .map((_, beat) => {
            const cellKey = `${note.name}-${chordIndex}-${beat}`;
            const currentNote = melody?.[chordIndex]?.[beat];
            const isSelected =
              currentNote && currentNote.relativePos === note.index;
            const currentBassNote = bass?.[chordIndex]?.[beat];
            const isBassSelected =
              currentBassNote && currentBassNote.relativePos == note.index;
            return (
              <TouchableOpacity
                key={cellKey}
                style={[
                  {
                    backgroundColor: isSelected ? tint : tab,
                  },
                  styles.gridCell,
                ]}
                onPress={() => {
                  playSound(note.index, note.name),
                    handleNoteInput(chordIndex, beat);
                }}
              >
                {isBassSelected && <View style={styles.overlay}></View>}
                <ThemedText type="small">
                  {getDisplay(chordItem.chord)}
                </ThemedText>
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: "rgba(91, 157, 192, 0.2)",
  },
});
