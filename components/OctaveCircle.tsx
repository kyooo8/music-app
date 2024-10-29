import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useState, useRef, useEffect } from "react";

import { useThemeColor } from "@/hooks/useThemeColor";

interface Props {
  notes: string[];
}

export function OctaveCircle({ notes }: Props) {
  const circleColor = useThemeColor({}, "circle");
  const circleTextColor = useThemeColor({}, "circleText");

  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (selectedNote !== null) {
      const index = notes.indexOf(selectedNote);
      if (index !== -1) {
        const angle = (360 / notes.length) * index;
        const toValue = -angle;
        Animated.timing(rotation, {
          toValue,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [selectedNote, notes, rotation]);

  const animatedStyle = {
    transform: [
      {
        rotate: rotation.interpolate({
          inputRange: [-360, 0, 360],
          outputRange: ["-360deg", "0deg", "360deg"],
        }),
      },
    ],
  };

  const inverseRotation = rotation.interpolate({
    inputRange: [-360, 0, 360],
    outputRange: ["360deg", "0deg", "-360deg"],
  });

  // 円のサイズに基づいて半径を計算
  const circleSize = 380;
  const radius = circleSize / 2 - 50; // パディングとして50を調整

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.circle, { backgroundColor: circleColor }, animatedStyle]}
      >
        {notes.map((note, index) => {
          // 各音階の角度を計算
          const angle = (360 / notes.length) * index;
          const rad = (angle * Math.PI) / 180;

          // xとyの位置を計算
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);

          return (
            <TouchableOpacity
              key={note}
              onPress={() => setSelectedNote(note)}
              activeOpacity={0.7}
              style={[
                styles.noteContainer,
                {
                  position: "absolute",
                  left: circleSize / 2 + x - 20, // 20はテキスト幅の半分
                  top: circleSize / 2 + y - 20, // 20はテキスト高さの半分
                },
              ]}
            >
              <Animated.View
                style={{ transform: [{ rotate: inverseRotation }] }}
              >
                <Text style={[styles.text, { color: circleTextColor }]}>
                  {note}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 380,
    height: 380,
    borderRadius: 190,
    alignItems: "center",
    justifyContent: "center",
  },
  noteContainer: {
    width: 50, // テキストサイズに基づいて調整
    height: 50, // テキストサイズに基づいて調整
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 36, // 好みに応じて調整
    textAlign: "center",
  },
});
