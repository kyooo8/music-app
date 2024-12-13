import React, { useEffect, useState, useCallback, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { MusicContext } from "@/MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { Icon } from "./Icon";
import { v4 as uuidv4 } from "uuid";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ChordDisplayItem {
  id: string;
  index: number;
  chordIndex: number;
}

export const ChordProgression = () => {
  const tab = useThemeColor({}, "tab");

  const { scaleNotes, chordProgression, setChordProgression } =
    useContext(MusicContext);
  const [showPlusIndices, setShowPlusIndices] = useState<number[]>([]);
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
          style={[styles.chordCard, { backgroundColor: "#bbbb" }]}
          onLongPress={() => handleLongPress(item.index)}
          activeOpacity={0.8}
          onPress={() => {
            isShowPlus && deleteChord(item.index);
          }}
        >
          <ThemedText type="title">
            {scaleNotes ? (
              isShowPlus ? (
                <Icon name="bin2" size={15} color="red" />
              ) : (
                scaleNotes[item.chordIndex]
              )
            ) : (
              ""
            )}
          </ThemedText>
        </TouchableOpacity>
      );
    },
    [showPlusIndices, handleLongPress, deleteChord, scaleNotes]
  );

  return (
    <View style={[styles.chordProgressionContainer, { backgroundColor: tab }]}>
      <ThemedText type="subtitle">コード進行</ThemedText>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chordProgressionContainer: {
    width: "100%",
    maxWidth: 350,
    marginTop: 30,
    padding: 20,
    borderRadius: 8,
  },
  flatList: {
    marginTop: 10,
  },
  chordCard: {
    marginRight: 10,
    padding: 20,
    width: 60,
    borderRadius: 8,
    alignItems: "center",
  },
});
