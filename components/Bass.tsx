import React, { useContext, useEffect, useMemo, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { MelobassData } from "@/types/music";
import { MusicContext } from "@/context/MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { BassParts } from "@/components/BassParts";
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

export default function BassPage({ chordEntries }: Props) {
  const {
    root,
    chordProgression,
    bass,
    setBass,
    scaleNotes,
    sortedMelodyNotes,
  } = useContext(MusicContext);

  const tint = useThemeColor({}, "tint");

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrllRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!bass && chordProgression) {
      const measureCount = Object.keys(chordProgression).length;
      const newMelody: MelobassData = {};
      for (let m = 0; m < measureCount; m++) {
        const measureObj: { [beat: number]: null } = {};
        for (let b = 0; b < 4; b++) {
          measureObj[b] = null;
        }
        newMelody[m] = measureObj;
      }
      setBass(newMelody);
    }
  }, [chordProgression, setBass, bass]);

  return (
    <ThemedView style={[styles.container]}>
      {chordProgression && chordEntries.length > 0 ? (
        <>
          <View style={styles.chordRow}>
            <View style={{ width: 44.3 }}></View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={horizontalScrllRef}
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
                <View key={noteIndex} style={styles.noteLabel}>
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
                horizontalScrllRef.current?.scrollTo({
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
                      <BassParts
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
    marginBottom: 30,
  },
  noteLabelContainer: {
    width: 50,
  },
  noteLabelContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
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
