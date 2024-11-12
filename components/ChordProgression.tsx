import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import Icon from "./Icon";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

interface Props {
  scaleNotes: string[] | null;
  chordProgression: number[];
  setChordPorgression: React.Dispatch<React.SetStateAction<number[]>>;
}

interface ChordItem {
  key: string;
  chordIndex: number;
  index: number;
}

export function ChordProgression({
  scaleNotes,
  chordProgression,
  setChordPorgression,
}: Props) {
  const [showPlusSet, setShowPlusSet] = useState<Set<number>>(new Set());

  const bg = useThemeColor({}, "ChordProgression");

  // ドラッグ可能なデータに変換
  const [data, setData] = useState<ChordItem[]>(
    chordProgression.map((chord, index) => ({
      key: `${index}`, // 一意のキー
      chordIndex: chord,
      index: index,
    }))
  );

  useEffect(() => {
    // chordProgressionが変更されたときにdataを更新
    setData(
      chordProgression.map((chord, index) => ({
        key: `${index}`,
        chordIndex: chord,
        index: index,
      }))
    );
    setShowPlusSet(new Set());
  }, [chordProgression, scaleNotes]);

  // ドラッグ終了時のハンドラー
  const handleDragEnd = ({ data }: { data: ChordItem[] }) => {
    setData(data);
    // chordProgressionを更新
    setChordPorgression(data.map((item) => item.chordIndex));
  };

  // 長押しでプラスボタンを表示
  function handleLongPress(index: number) {
    setShowPlusSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }

  // コードの追加
  function handleAddChord(index: number) {
    setChordPorgression((prev) => [
      ...prev.slice(0, index + 1),
      prev[index], // 同じコードを追加
      ...prev.slice(index + 1),
    ]);
  }

  // コードの削除
  function deleteChord(index: number) {
    setChordPorgression((prev) => prev.filter((_, i) => i !== index));
    setData((prev) => prev.filter((item) => item.index !== index));
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ThemedText style={styles.title}>コード進行</ThemedText>
      <DraggableFlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.chordProgression}
      />
    </View>
  );

  // 各アイテムのレンダリング関数
  function renderItem({ item, drag, isActive }: RenderItemParams<ChordItem>) {
    const index = item.index;
    const isShowPlus = showPlusSet.has(index);

    return (
      <TouchableOpacity
        style={[styles.chordCard, { opacity: isActive ? 0.8 : 1.0 }]}
        onLongPress={() => {
          handleLongPress(index);
        }}
      >
        {isShowPlus && (
          <>
            <View style={styles.chordSetting}>
              <TouchableOpacity
                onPress={() => {
                  deleteChord(index);
                }}
              >
                <Icon name={"bin2"} size={15} color={"red"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddChord(index)}>
                <Icon name={"plus"} size={25} color={"green"} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.change} onPressIn={drag}>
              <Icon
                name="change"
                size={25}
                color="gray"
                style={styles.dragHandle}
              />
            </TouchableOpacity>
          </>
        )}
        <ThemedText type="title">
          {scaleNotes ? scaleNotes[item.chordIndex] : ""}
        </ThemedText>
      </TouchableOpacity>
    );
  }
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
    paddingHorizontal: 2,
  },
  dragHandle: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
  change: {
    position: "absolute",
    top: "50%",
    zIndex: 1,
    backgroundColor: "#ffffff",
  },
});
