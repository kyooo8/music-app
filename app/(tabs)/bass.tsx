import React, { useContext, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ChordContext } from "../../ChordContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { BassParts } from "@/components/BassParts";
import { PlayBtn } from "@/components/PlayBtn";
import { Bpm } from "@/components/Bpm";
import { ToggleButton } from "@/components/ToggleBtn";
import {
  cellheight,
  cellmargin,
  cellWidth,
  lastItemMargin,
} from "@/constants/Style";

const BassInputScreen = () => {
  const bg = Colors.dark.background;
  const { chordProgression, bass, setBass, scaleNotes, sortedMelodyNotes } =
    useContext(ChordContext);

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrllRef = useRef<ScrollView>(null);

  // Melody 初期化
  useEffect(() => {
    if (bass.length !== chordProgression.length) {
      setBass(chordProgression.map(() => Array(4).fill(-1)));
    }
  }, [chordProgression, bass.length, setBass]);

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
                <View key={index} style={styles.chordCell}>
                  <ThemedText>
                    {scaleNotes ? scaleNotes[chordIndex] : ""}
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 音階ラベルとメロディーグリッド */}
          <View style={styles.gridContainer}>
            {/* 音階ラベル */}
            <ScrollView
              ref={verticalScrollRef}
              showsVerticalScrollIndicator={false}
              style={styles.noteLabelContainer}
              contentContainerStyle={styles.noteLabelContent}
            >
              {[...sortedMelodyNotes].reverse().map((note, noteIndex) => (
                <View key={noteIndex} style={styles.noteLabel}>
                  <ThemedText>{note.name}</ThemedText>
                </View>
              ))}
            </ScrollView>

            {/* メロディーグリッド (横スクロール時にコード進行も同期) */}
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
                    {chordProgression.map((thisChordIndex, chordIndex) => (
                      <BassParts
                        key={`${chordIndex}-${noteIndex}`}
                        note={note}
                        chordIndex={chordIndex}
                        thisChordIndex={thisChordIndex}
                      />
                    ))}
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          </View>

          {/* 現在のメロディー表示 */}
          {/* <View style={styles.melodyContainer}>
            <ThemedText>現在のbass:</ThemedText>
            {bass.map((chordBass, chordIndex) => {
              const chordNote =
                scaleNotes &&
                chordProgression[chordIndex] !== undefined &&
                chordProgression[chordIndex] < sortedMelodyNotes.length
                  ? scaleNotes[chordProgression[chordIndex]]
                  : "未定義";

              return (
                <ThemedText key={chordIndex}>
                  {chordNote}:{" "}
                  {chordBass
                    .map((noteIndex) =>
                      noteIndex !== -1
                        ? sortedMelodyNotes[noteIndex]?.name || ""
                        : "-"
                    )
                    .join(", ")}
                </ThemedText>
              );
            })}
          </View> */}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <ThemedText>コード進行を選択してください。</ThemedText>
        </View>
      )}
    </View>
  );
};

export default BassInputScreen;

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
