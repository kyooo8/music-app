// ChordProgression.tsx
import React, { useEffect, useState, useCallback, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { ChordContext } from "@/ChordContext";
import { ThemedText } from "@/components/ThemedText";
import Icon from "./Icon";
import { v4 as uuidv4 } from "uuid"; // UUIDのインポート
import { Colors } from "@/constants/Colors";

interface ChordItem {
  id: string;
  chordIndex: number;
}

export function ChordProgression() {
  const { scaleNotes, chordProgression, setChordProgression } =
    useContext(ChordContext);
  const [showPlusIndices, setShowPlusIndices] = useState<number[]>([]);

  const bg = Colors.dark.tab;

  // Initialize data with unique IDs using UUID
  const [data, setData] = useState<ChordItem[]>(
    chordProgression.map((chord) => ({
      id: uuidv4(),
      chordIndex: chord,
    }))
  );

  useEffect(() => {
    // Sync data with chordProgression changes
    setData(
      chordProgression.map((chord) => ({
        id: uuidv4(),
        chordIndex: chord,
      }))
    );
    setShowPlusIndices([]);
  }, [chordProgression, scaleNotes]);

  // Toggle visibility of plus buttons
  const handleLongPress = useCallback((index: number) => {
    setShowPlusIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  }, []);

  // Add a chord after the specified index
  const handleAddChord = useCallback(
    (index: number) => {
      setChordProgression((prev) => {
        const newChord = prev[index];
        const newProgression = [
          ...prev.slice(0, index + 1),
          newChord,
          ...prev.slice(index + 1),
        ];
        return newProgression;
      });
    },
    [setChordProgression]
  );

  // Delete the chord at the specified index
  const deleteChord = useCallback(
    (index: number) => {
      setChordProgression((prev) => prev.filter((_, i) => i !== index));
      setData((prev) => prev.filter((_, i) => i !== index));
    },
    [setChordProgression]
  );

  // Render item without drag functionality
  const renderItem = useCallback(
    ({ item, index }: { item: ChordItem; index: number }) => {
      const isShowPlus = showPlusIndices.includes(index);

      return (
        <TouchableOpacity
          style={styles.chordCard}
          onLongPress={() => handleLongPress(index)}
          activeOpacity={0.8}
        >
          {isShowPlus && (
            <>
              <View style={styles.chordSetting}>
                <TouchableOpacity
                  onPress={() => deleteChord(index)}
                  style={styles.settingButton}
                >
                  <Icon name="bin2" size={15} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAddChord(index)}
                  style={styles.settingButton}
                >
                  <Icon name="plus" size={25} color="green" />
                </TouchableOpacity>
              </View>
            </>
          )}
          <ThemedText type="title">
            {scaleNotes ? scaleNotes[item.chordIndex] : ""}
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
    padding: 10, // パディングを追加
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
