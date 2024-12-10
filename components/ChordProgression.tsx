// ChordProgression.tsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { ChordContext } from "@/MusicContext";
import { ThemedText } from "@/components/ThemedText";
import Icon from "./Icon";
import { v4 as uuidv4 } from "uuid";
import { Colors } from "@/constants/Colors";

interface ChordDisplayItem {
  id: string;
  index: number; // chordProgressionのキー
  chordIndex: number; // chordItem.chord
}

export function ChordProgression() {
  const { root, scaleNotes, chordProgression, setChordProgression } =
    useContext(ChordContext);
  const [showPlusIndices, setShowPlusIndices] = useState<number[]>([]);
  const bg = Colors.dark.tab;

  const [data, setData] = useState<ChordDisplayItem[]>([]);

  useEffect(() => {
    if (!chordProgression) {
      setData([]);
      setShowPlusIndices([]);
      return;
    }
    const entries = Object.entries(chordProgression).map(([k, v]) => ({
      id: uuidv4(),
      index: Number(k),
      chordIndex: v.chord,
    }));
    setData(entries);
    setShowPlusIndices([]);
  }, [chordProgression, scaleNotes]);

  const handleLongPress = useCallback((index: number) => {
    setShowPlusIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }, []);

  const handleAddChord = useCallback(
    (index: number) => {
      setChordProgression((prev) => {
        if (!prev) return prev;
        const entries = Object.entries(prev)
          .map(
            ([k, v]) =>
              [Number(k), v] as [number, { chord: number; shape: string }]
          )
          .sort((a, b) => a[0] - b[0]);

        if (entries.length >= 8) {
          alert("最大8個まで");
          return prev;
        }

        const pos = entries.findIndex(([i]) => i === index);
        if (pos === -1) return prev;
        const chordToInsert = entries[pos][1];
        // 新しいコードを同じchordで挿入
        // pos+1に挿入
        entries.splice(pos + 1, 0, [0, chordToInsert]);
        // キーを0から再割当
        entries.forEach((e, i) => {
          e[0] = i;
        });
        return Object.fromEntries(entries.map(([i, v]) => [i, v]));
      });
    },
    [setChordProgression]
  );

  const deleteChord = useCallback(
    (index: number) => {
      setChordProgression((prev) => {
        if (!prev) return prev;
        const entries = Object.entries(prev)
          .map(
            ([k, v]) =>
              [Number(k), v] as [number, { chord: number; shape: string }]
          )
          .sort((a, b) => a[0] - b[0]);

        const pos = entries.findIndex(([i]) => i === index);
        if (pos === -1) return prev;
        entries.splice(pos, 1);
        // 再割当
        entries.forEach((e, i) => {
          e[0] = i;
        });
        return Object.fromEntries(entries.map(([i, v]) => [i, v]));
      });
      setData((prev) => prev.filter((item) => item.index !== index));
    },
    [setChordProgression]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChordDisplayItem }) => {
      const isShowPlus = showPlusIndices.includes(item.index);

      return (
        <TouchableOpacity
          style={styles.chordCard}
          onLongPress={() => handleLongPress(item.index)}
          activeOpacity={0.8}
        >
          {isShowPlus && (
            <View style={styles.chordSetting}>
              <TouchableOpacity
                onPress={() => deleteChord(item.index)}
                style={styles.settingButton}
              >
                <Icon name="bin2" size={15} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAddChord(item.index)}
                style={styles.settingButton}
              >
                <Icon name="plus" size={25} color="green" />
              </TouchableOpacity>
            </View>
          )}
          <ThemedText type="title">
            {scaleNotes && scaleNotes[item.chordIndex]
              ? scaleNotes[item.chordIndex]
              : ""}
          </ThemedText>
        </TouchableOpacity>
      );
    },
    [showPlusIndices, handleLongPress, deleteChord, handleAddChord, scaleNotes]
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ThemedText style={styles.title}>コード進行</ThemedText>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chordProgression}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    marginVertical: 30,
    borderRadius: 16,
    padding: 10,
  },
  chordProgression: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  chordCard: {
    borderColor: "#000000",
    borderWidth: 2,
    paddingVertical: 20,
    borderRadius: 8,
    marginRight: 20,
    position: "relative",
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  chordSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 5,
  },
  settingButton: {
    padding: 5,
  },
});
