import React, { useContext, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { MusicContext } from "@/context/MusicContext";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Audio } from "expo-av";
import {
  dramInstruments,
  fadeOutSound,
  loadDramSound,
} from "@/hooks/playMusicLogic";
import { dramSoundsMap } from "@/constants/soundMaps";

interface Props {
  note: string;
  chordIndex: number;
  noteIndex: number;
}

const sound = new Audio.Sound();

const DramParts = React.memo(({ note, chordIndex, noteIndex }: Props) => {
  const tab = useThemeColor({}, "tab");
  const tint = useThemeColor({}, "tint");
  const { dram, setDram } = useContext(MusicContext);

  const playSound = async (noteIndex: number) => {
    try {
      const instrumentName = dramInstruments[noteIndex];
      const soundFile = dramSoundsMap[instrumentName];
      if (sound._loaded) {
        await sound.unloadAsync();
      }
      await sound.loadAsync(soundFile);
      await sound.playAsync();
      setTimeout(async () => {
        await fadeOutSound(sound, 1000);
      }, 800);
    } catch (error) {
      console.error("音楽再生エラー", error);
    }
  };

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
              onPress={() => {
                playSound(noteIndex);
                handleNoteInput(chordIndex, noteIndex, step);
              }}
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
    height: cellheight + 14,
    alignItems: "center",
    justifyContent: "center",
    margin: cellmargin,
    borderRadius: 4,
  },
});

export default DramParts;
