// Melody.tsx
import React, { useContext, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import { MusicContext } from "@/context/MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { MelodyParts } from "@/components/MelodyParts";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { MelobassData } from "@/types/music";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  chordEntries: [
    number,
    {
      chord: number;
      shape: string;
    }
  ][];
}

export default function MelodyPage({ chordEntries }: Props) {
  const {
    root,
    chordProgression,
    scaleNotes,
    sortedMelodyNotes,
    melody,
    setMelody,
  } = useContext(MusicContext);
  const tint = useThemeColor({}, "tint");

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!melody && chordProgression) {
      const measureCount = Object.keys(chordProgression).length;

      const newMelody: MelobassData = {};
      for (let m = 0; m < measureCount; m++) {
        const measureObj: { [beat: number]: null } = {};
        for (let b = 0; b < 4; b++) {
          measureObj[b] = null;
        }
        newMelody[m] = measureObj;
      }
      setMelody(newMelody);
    }
  }, [chordProgression, setMelody, melody]);

  return (
    <ThemedView style={styles.container}>
      {chordProgression && chordEntries.length > 0 ? (
        <>
          <View style={styles.chordRow}>
            <View style={{ width: 44.3 }}></View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={horizontalScrollRef}
              scrollEventThrottle={16}
            >
              {chordEntries.map(([index, chordItem]) => (
                <View key={index} style={styles.chordCell}>
                  <ThemedText>{scaleNotes[chordItem.chord] || ""}</ThemedText>
                  <ThemedText>
                    {"major" === chordItem.shape ? "" : chordItem.shape}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.gridContainer}>
            <ScrollView
              ref={verticalScrollRef}
              showsVerticalScrollIndicator={false}
              style={styles.noteLabelContainer}
              contentContainerStyle={styles.noteLabelContent}
            >
              {[...sortedMelodyNotes].reverse().map((note, noteIndex) => (
                <View key={noteIndex} style={[styles.noteLabel]}>
                  <ThemedText style={root === note.name && { color: tint }}>
                    {note.name}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                horizontalScrollRef.current?.scrollTo({
                  x: offsetX,
                  animated: false,
                });
              }}
              scrollEventThrottle={16}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  verticalScrollRef.current?.scrollTo({
                    y: offsetY,
                    animated: false,
                  });
                }}
                scrollEventThrottle={16}
              >
                {[...sortedMelodyNotes].reverse().map((note, noteIndex) => (
                  <View key={noteIndex} style={styles.noteRow}>
                    {chordEntries.map(([thisChordIndex, chordItem]) => (
                      <MelodyParts
                        key={`${thisChordIndex}-${noteIndex}`}
                        note={note}
                        chordIndex={thisChordIndex}
                        chordItem={chordItem}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText>コード進行を選択してください。</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chordRow: {
    height: 40,
    flexDirection: "row",
  },
  chordCell: {
    flexDirection: "row",
    width: cellWidth * 4 + cellmargin * 6,
    marginRight: lastItemMargin + cellmargin,
    marginLeft: cellmargin,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flex: 1,
  },
  noteLabelContainer: {
    width: 50,
  },
  noteLabelContent: {
    flexGrow: 1,
  },
  noteLabel: {
    height: cellheight,
    margin: cellmargin,
    justifyContent: "center",
    alignItems: "center",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
