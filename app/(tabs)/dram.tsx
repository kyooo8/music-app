import React, { useState, useContext, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { ChordContext } from "../../ChordContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MelodyParts } from "@/components/MelodyParts";
import { PlayBtn } from "@/components/PlayBtn";
import { Bpm } from "@/components/Bpm";
import { ToggleButton } from "@/components/ToggleBtn";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";
import { DramParts } from "@/components/DramParts";

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
  ];

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrllRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (dram.length !== chordProgression.length) {
      // chordProgression の長さ分だけ繰り返し、各要素は9x4の配列
      setDram(
        chordProgression.map(() =>
          Array.from({ length: 9 }, () => Array(4).fill(false))
        )
      );
    }
  }, [chordProgression, dram.length, setDram]);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.settingContainer}>
        <PlayBtn />
        <View style={{ position: "absolute", right: 10 }}>
          <Bpm />
          <ToggleButton />
        </View>
      </View>
      {chordProgression && chordProgression.length > 0 ? (
        <>
          {/* コード進行の表示 */}
          <View style={styles.chordRow}>
            {/* 音階ラベル部分と位置合わせするため、noteLabelContainerを外側に配置 */}
            <View style={{ width: 44.3 }}></View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={horizontalScrllRef}
              scrollEventThrottle={16}
            >
              {chordProgression.map((chordIndex, index) => (
                <View
                  key={index}
                  style={[styles.chordCell, { backgroundColor: tab }]}
                >
                  <ThemedText>
                    {scaleNotes ? scaleNotes[chordIndex] : ""}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.gridContainer}>
            {/* ラベル */}
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

            {/* グリッド (横スクロール時にコード進行も同期) */}
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
                    {chordProgression.map((_, chordIndex) => (
                      <DramParts
                        key={`${chordIndex}-${noteIndex}`}
                        note={note}
                        chordIndex={chordIndex}
                        dramNotes={dramNotes}
                        noteIndex={noteIndex}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          </View>

          {/* 現在のドラム表示 */}
          {/* <ScrollView style={styles.melodyContainer}>
            <ThemedText>ドラム</ThemedText>
            {dram.map((d, chordIndex) => (
              <View key={chordIndex}>
                <ThemedText>Chord {chordIndex}:</ThemedText>
                {d.map((row, rowIndex) => (
                  <ThemedText key={rowIndex}>{row.join(", ")}</ThemedText>
                ))}
              </View>
            ))}
          </ScrollView> */}
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
  melodyContainer: {
    height: "20%",
    padding: 10,
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
