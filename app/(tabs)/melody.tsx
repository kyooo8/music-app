// melody.tsx
import { useContext, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { ChordContext } from "../../MusicContext";
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

const MelodyInputScreen = () => {
  const bg = Colors.dark.background;
  const { chordProgression, melody, setMelody, scaleNotes, sortedMelodyNotes } =
    useContext(ChordContext);

  const verticalScrollRef = useRef<ScrollView>(null);
  const horizontalScrllRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!chordProgression) return;
    const measureCount = Object.keys(chordProgression).length;
    const currentMelodyCount = melody ? Object.keys(melody).length : 0;

    if (currentMelodyCount !== measureCount) {
      // melody再初期化
      const newMelody: {
        [measure: number]: {
          [beat: number]: { relativePos: number; duration: string } | null;
        };
      } = {};

      for (let m = 0; m < measureCount; m++) {
        const measureObj: { [beat: number]: null } = {};
        for (let b = 0; b < 4; b++) {
          measureObj[b] = null;
        }
        newMelody[m] = measureObj;
      }

      setMelody(newMelody);
    }
  }, [chordProgression, melody, setMelody]);

  const chordEntries = chordProgression
    ? Object.entries(chordProgression)
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
                <View key={index} style={styles.chordCell}>
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
              {[...sortedMelodyNotes].reverse().map((note, noteIndex) => (
                <View key={noteIndex} style={styles.noteLabel}>
                  <ThemedText>{note.name}</ThemedText>
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
    </View>
  );
};

export default MelodyInputScreen;

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
