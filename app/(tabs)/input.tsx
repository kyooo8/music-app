import React, { useContext, useState, useMemo } from "react";
import MelodyPage from "../../components/Melody";
import BassPage from "../../components/Bass";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { MusicContext } from "@/context/MusicContext";
import { Icon } from "@/components/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { HeaderBottom } from "@/components/HeaderBottom";
import DramPage from "@/components/Dram";

type Mode = "melody" | "bass" | "dram";

export default function MelobassPage() {
  const tab = useThemeColor({}, "tab");
  const tint = useThemeColor({}, "tint");
  const circle = useThemeColor({}, "circle");
  const { chordProgression } = useContext(MusicContext);
  const [mode, setMode] = useState<Mode>("melody");

  // chordEntriesの計算をメモ化
  const chordEntries = useMemo(() => {
    if (!chordProgression) return [];
    return Object.entries(chordProgression)
      .map(
        ([k, v]) => [Number(k), v] as [number, { chord: number; shape: string }]
      )
      .sort((a, b) => a[0] - b[0]);
  }, [chordProgression]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={[styles.selecter, { backgroundColor: tab }]}>
        <TouchableOpacity
          onPress={() => setMode("melody")}
          style={[styles.selectIcon, { marginLeft: 20 }]}
        >
          <Icon
            size={36}
            name="melody"
            color={mode === "melody" ? tint : circle}
          ></Icon>
          <ThemedText type="small">メロディー</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("bass")}
          style={styles.selectIcon}
        >
          <Icon
            size={36}
            name="bass"
            color={mode === "bass" ? tint : circle}
          ></Icon>
          <ThemedText type="small">ベース</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode("dram")}
          style={styles.selectIcon}
        >
          <Icon
            size={36}
            name="dram"
            color={mode === "dram" ? tint : circle}
          ></Icon>
          <ThemedText type="small">ドラム</ThemedText>
        </TouchableOpacity>
      </View>

      {mode === "melody" ? (
        <MelodyPage chordEntries={chordEntries} />
      ) : mode === "bass" ? (
        <BassPage chordEntries={chordEntries} />
      ) : (
        <DramPage />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selecter: {
    flexDirection: "row",
    marginTop: 60,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: "auto",
    borderRadius: 8,
  },
  selectIcon: {
    marginRight: 26,
    marginBlock: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
