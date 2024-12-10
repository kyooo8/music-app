// DramPage.tsx
import React, { useEffect, useRef, useContext } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ChordContext } from "../../MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { DramParts } from "@/components/DramParts";
import { PlayBtn } from "@/components/PlayBtn";
import { Bpm } from "@/components/Bpm";
import { ToggleButton } from "@/components/ToggleBtn";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";

export default function DramPage() {
  const { chordProgression, scaleNotes, dram, setDram } =
    useContext(ChordContext);

  const bg = Colors.dark.background;
  const tab = Colors.dark.tab;
  const dramNotes = [
    "Fハイハット",
    "タムタム",
    "フロアタム",
    "クラッシュ",
    "ライド",
    "Oハイハット",
    "Cハイハット",
    "スネア",
    "バス",
    "ハンドクラップ",
  ];

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrllRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!chordProgression) return;
    const measureCount = Object.keys(chordProgression).length;
    const currentDramCount = dram ? Object.keys(dram).length : 0;

    if (currentDramCount !== measureCount) {
      // dram初期化: measureCount×10楽器×16ステップすべてfalse
      const newDram: {
        [measure: number]: {
          [instrument: number]: {
            [step: number]: boolean;
          };
        };
      } = {};

      for (let m = 0; m < measureCount; m++) {
        const measureObj: {
          [instrument: number]: { [step: number]: boolean };
        } = {};
        for (let i = 0; i < 10; i++) {
          const instrumentObj: { [step: number]: boolean } = {};
          for (let s = 0; s < 16; s++) {
            instrumentObj[s] = false;
          }
          measureObj[i] = instrumentObj;
        }
        newDram[m] = measureObj;
      }

      setDram(newDram);
    }
  }, [chordProgression, dram, setDram]);

  const chordEntries = chordProgression
    ? (
        Object.entries(chordProgression) as [
          string,
          { chord: number; shape: string }
        ][]
      )
        .map(
          ([k, v]) =>
            [Number(k), v] as [number, { chord: number; shape: string }]
        )
        .sort((a, b) => a[0] - b[0])
    : [];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.settingContainer}>
        <PlayBtn />
        <View style={{ position: "absolute", right: 10 }}>
          <Bpm />
          <ToggleButton />
        </View>
      </View>
      {chordProgression && chordEntries.length > 0 ? (
        <>
          {/* コード進行の表示 */}
          <View style={styles.chordRow}>
            <View style={{ width: 44.3 }}></View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={horizontalScrllRef}
              scrollEventThrottle={16}
            >
              {chordEntries.map(([index, chordItem]) => (
                <View
                  key={index}
                  style={[styles.chordCell, { backgroundColor: tab }]}
                >
                  <ThemedText>{scaleNotes[chordItem.chord] || ""}</ThemedText>
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
              {dramNotes.map((note, noteIndex) => (
                <View
                  key={noteIndex}
                  style={[styles.noteLabel, { backgroundColor: tab }]}
                >
                  <ThemedText>{note}</ThemedText>
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
                {dramNotes.map((note, noteIndex) => (
                  <View key={noteIndex} style={styles.noteRow}>
                    {chordEntries.map(([thisChordIndex, chordItem]) => (
                      <DramParts
                        key={`${thisChordIndex}-${noteIndex}`}
                        note={note}
                        chordIndex={thisChordIndex}
                        noteIndex={noteIndex}
                        dramNotes={dramNotes}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chordRow: {
    height: "10%",
    flexDirection: "row",
    marginTop: 30,
  },
  chordCell: {
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
  noteLabelContent: {},
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
  settingContainer: {
    position: "relative",
    width: "100%",
    marginTop: 16,
  },
});
