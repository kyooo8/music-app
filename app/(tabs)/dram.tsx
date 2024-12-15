import React, {
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { MusicContext } from "../../MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HeaderBottom } from "@/components/HeaderBottom";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DramData } from "@/types/music";
import DramParts from "@/components/DramParts";

const dramNotes = [
  "f-hihat",
  "ハイタム",
  "ロータム",
  "clash",
  "ライド",
  "o-hihat",
  "c-hihat",
  "スネア",
  "バス",
  "手拍子",
];

const DramPage = () => {
  const tab = useThemeColor({}, "tab");
  const { chordProgression, scaleNotes, dram, setDram } =
    useContext(MusicContext);

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  // ドラムの初期化
  useEffect(() => {
    if (!chordProgression) return;
    const measureCount = Object.keys(chordProgression).length;
    const currentDramCount = dram ? Object.keys(dram).length : 0;

    if (currentDramCount !== measureCount) {
      const newDram: DramData = {};

      for (let m = 0; m < measureCount; m++) {
        const measureObj: {
          [instrument: number]: { [step: number]: boolean };
        } = {};
        for (let i = 0; i < dramNotes.length; i++) {
          const instrumentObj: { [step: number]: boolean } = {};
          for (let s = 0; s < 8; s++) {
            instrumentObj[s] = false;
          }
          measureObj[i] = instrumentObj;
        }
        newDram[m] = measureObj;
      }

      setDram(newDram);
    }
  }, []);

  // chordEntries をメモ化
  const chordEntries = useMemo(() => {
    if (!chordProgression) return [];
    return Object.entries(chordProgression)
      .map(
        ([k, v]) => [Number(k), v] as [number, { chord: number; shape: string }]
      )
      .sort((a, b) => a[0] - b[0]);
  }, [chordProgression]);

  return (
    <ThemedView style={styles.container}>
      <HeaderBottom />
      {chordProgression && chordEntries.length > 0 ? (
        <>
          {/* コード進行の表示 */}
          <View style={styles.chordRow}>
            <View style={styles.chordSpacer} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={horizontalScrollRef}
              scrollEventThrottle={16}
            >
              {chordEntries.map(([index, chordItem]) => (
                <View key={index} style={styles.chordCell}>
                  <ThemedText>{scaleNotes[chordItem.chord] || ""}</ThemedText>
                  <ThemedText>{chordItem.shape}</ThemedText>
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
                <View key={noteIndex} style={styles.noteLabel}>
                  <ThemedText>{note}</ThemedText>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={useCallback((event: any) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                horizontalScrollRef.current?.scrollTo({
                  x: offsetX,
                  animated: false,
                });
              }, [])}
              scrollEventThrottle={16}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={useCallback((event: any) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  verticalScrollRef.current?.scrollTo({
                    y: offsetY,
                    animated: false,
                  });
                }, [])}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chordRow: {
    height: "10%",
    flexDirection: "row",
    marginTop: 30,
  },
  chordSpacer: {
    width: 44.3,
  },
  chordCell: {
    width: (cellWidth * 2 + cellmargin * 6) * 2,
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
    width: 90,
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
});

export default DramPage;
