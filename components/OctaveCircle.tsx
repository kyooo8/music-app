import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  notes: string[];
}

export function OctaveCircle({ notes }: Props) {
  const circleColor = useThemeColor({}, "circle");
  const circleTextColor = useThemeColor({}, "circleText");

  return (
    <View style={[styles.circle, { backgroundColor: circleColor }]}>
      {notes.map((note, index) => {
        // 各音階の角度を計算
        const angle = (360 / notes.length) * index;
        return (
          <View
            key={note}
            style={[
              styles.noteContainer,
              {
                transform: [
                  { rotate: `${angle}deg` },
                  { translateX: 170 }, // 円周からの距離を設定
                  { rotate: `${-angle}deg` }, // テキストの向きを下向きにする
                ],
              },
            ]}
          >
            <Text style={[styles.text, { color: circleTextColor }]}>
              {note}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 380,
    height: 380,
    borderRadius: 190,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  noteContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  text: { fontSize: 16, textAlign: "center" },
});
