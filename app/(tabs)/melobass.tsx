import React, { useContext, useState, useMemo } from "react";
import MelodyPage from "../../components/Melody";
import BassPage from "../../components/Bass";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { MusicContext } from "@/MusicContext";
import { Icon } from "@/components/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { HeaderBottom } from "@/components/HeaderBottom";

type Mode = "melody" | "bass";

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
      <HeaderBottom></HeaderBottom>
      <View style={[styles.selecter, { backgroundColor: tab }]}>
        <TouchableOpacity
          onPress={() => setMode("melody")}
          style={styles.selectIcon}
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
      </View>

      {mode === "melody" ? (
        <MelodyPage chordEntries={chordEntries} />
      ) : (
        <BassPage chordEntries={chordEntries} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selecter: {
    flexDirection: "row",
    marginTop: 40,
    marginRight: 10,
    marginLeft: "auto",
    borderRadius: 8,
  },
  selectIcon: {
    marginInline: 16,
    marginBlock: 8,
  },
});
