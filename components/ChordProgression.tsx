import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Text,
  Alert,
} from "react-native";
import { MusicContext } from "@/MusicContext";
import { ThemedText } from "@/components/ThemedText";
import { Icon } from "./Icon";
import { v4 as uuidv4 } from "uuid";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ChordItem, ChordShape } from "@/types/music";

interface ChordDisplayItem {
  id: string;
  index: number;
  chordIndex: number;
  shape: ChordShape;
}

export const ChordProgression = () => {
  const tab = useThemeColor({}, "tab");
  const chordCard = useThemeColor({}, "chordCard");
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const red = useThemeColor({}, "melody");

  const { root, scaleNotes, chordProgression, setChordProgression } =
    useContext(MusicContext);
  const [data, setData] = useState<ChordDisplayItem[]>([]);
  const [selectedChordIndex, setSelectedChordIndex] = useState<number | null>(
    null
  );

  // モーダル表示の状態管理
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!chordProgression) {
      setData([]);
      return;
    }
    const entries = Object.entries(chordProgression).map(([k, v]) => ({
      id: uuidv4(),
      index: Number(k),
      chordIndex: v.chord,
      shape: v.shape,
    }));
    setData(entries);
  }, [chordProgression]);

  const handleLongPress = useCallback((index: number) => {
    setSelectedChordIndex(index);
    setModalVisible(true); // モーダルを表示
  }, []);

  const updateChordShape = useCallback(
    (shape: ChordShape) => {
      if (selectedChordIndex === null) return;
      // chordIndexを使用してルート判定
      const currentChord = data.find(
        (item) => item.index === selectedChordIndex
      );
      if (currentChord && scaleNotes[currentChord.chordIndex] === root) {
        setModalVisible(false); // モーダルを閉じる
        Alert.alert("ルート音は変更できません");
        return;
      }
      setChordProgression((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated[selectedChordIndex] = {
          ...updated[selectedChordIndex],
          shape,
        };
        return updated;
      });

      setModalVisible(false); // モーダルを閉じる
    },
    [selectedChordIndex, setChordProgression]
  );

  const renderItem = useCallback(
    ({ item }: { item: ChordDisplayItem }) => (
      <TouchableOpacity
        style={[styles.chordCard, { backgroundColor: chordCard }]}
        onLongPress={() => handleLongPress(item.index)}
      >
        <ThemedText type="small">
          {scaleNotes && (
            <>
              <ThemedText>{scaleNotes[item.chordIndex]}</ThemedText>
              <ThemedText>
                {item.shape === "major" ? "" : item.shape}
              </ThemedText>
            </>
          )}
        </ThemedText>
      </TouchableOpacity>
    ),
    [handleLongPress, scaleNotes, chordCard]
  );

  const deleteChord = useCallback(() => {
    if (selectedChordIndex === null) return;

    setChordProgression((prev) => {
      if (!prev) return prev;

      // オブジェクトをコピーしてから指定キーを削除
      const updated = { ...prev };
      delete updated[selectedChordIndex]; // 指定されたインデックスを削除
      return updated;
    });

    setModalVisible(false); // モーダルを閉じる
  }, [selectedChordIndex, setChordProgression]);

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

      {/* 型変更用のモーダル */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modal, { backgroundColor: tab }]}>
            <ThemedText type="subtitle">型を選択してください</ThemedText>
            {(["major", "7", "add9", "m", "M7", "susu4"] as ChordShape[]).map(
              (shape) => (
                <TouchableOpacity
                  key={shape}
                  style={[styles.modalButton, { borderColor: text }]}
                  onPress={() => updateChordShape(shape)}
                >
                  <ThemedText>{shape}</ThemedText>
                </TouchableOpacity>
              )
            )}
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: red }]}
              onPress={() => deleteChord()}
            >
              <ThemedText>削除</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: tint }]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText>閉じる</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  chordProgressionContainer: {
    width: "100%",
    height: "100%",
    maxWidth: 350,
    maxHeight: 200,
    marginTop: 40,
    marginBottom: 30,
    padding: 20,
    borderRadius: 8,
  },
  flatList: {
    marginTop: 24,
  },
  chordCard: {
    marginRight: 16,
    padding: 10,
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
});
