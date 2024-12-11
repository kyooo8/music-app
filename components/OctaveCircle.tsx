// OctaveCircle.tsx
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRef, useEffect, useContext } from "react";
import { ChordContext } from "@/MusicContext";
import { Colors } from "@/constants/Colors";
import { ChordItem } from "@/types/music";

export const OctaveCircle = () => {
  const {
    notes,
    scaleNotes,
    scaleType,
    setRoot,
    root,
    chordProgression,
    setChordProgression,
  } = useContext(ChordContext);
  const circleTextColor = Colors.dark.circleText;

  const lastTap = useRef<number | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const previousIndex = useRef<number>(notes.indexOf(root ? root : "C"));
  const accumulatedRotation = useRef(0);

  useEffect(() => {
    const currentIndex = notes.indexOf(root ? root : "C");
    const anglePerNote = 360 / notes.length;
    const angleDifference =
      ((currentIndex - previousIndex.current + notes.length) % notes.length) *
      anglePerNote;

    let shortestAngle =
      angleDifference > 180 ? angleDifference - 360 : angleDifference;

    accumulatedRotation.current -= shortestAngle;

    Animated.timing(rotation, {
      toValue: accumulatedRotation.current,
      duration: 500,
      useNativeDriver: true,
    }).start();

    previousIndex.current = currentIndex;
  }, [root]);

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

  const handleDoubleTap = (note: string) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      // ダブルタップ: root設定
      setRoot(note);
    }
    lastTap.current = now;
  };

  const handleLongPress = (note: string) => {
    if (scaleNotes?.includes(note)) {
      const chordIndex = scaleNotes.indexOf(note);
      setChordProgression((prev) => {
        if (!prev) {
          // prevがnullなら新たにオブジェクトを作成
          return { 0: { chord: chordIndex, shape: "maj7" } };
        }

        // Object.entriesでエントリを取得し、numberキーとChordItemであることを明示
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

        const nextIndex =
          entries.length > 0 ? entries[entries.length - 1][0] + 1 : 0;
        const newItem = { chord: chordIndex, shape: "major" };
        entries.push([nextIndex, newItem]);

        // entriesをオブジェクトに戻す
        const newObj = Object.fromEntries(entries.map(([i, v]) => [i, v]));
        return newObj;
      });
    } else if (!root) {
      alert("ルートを選んで");
    } else {
      alert("スケール外です");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]}>
        {notes.map((note, index) => {
          const angle = (360 / notes.length) * index - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 125 * Math.cos(rad);
          const y = 125 * Math.sin(rad);

          return (
            <TouchableOpacity
              key={note}
              onPress={() => handleDoubleTap(note)}
              onLongPress={() => handleLongPress(note)}
              activeOpacity={0.7}
              style={[
                styles.noteContainer,
                {
                  position: "absolute",
                  left: 160 + x - 25,
                  top: 160 + y - 25,
                },
              ]}
            >
              <Animated.View
                style={{ transform: [{ rotate: inverseRotation }] }}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      color:
                        scaleNotes.length === 0
                          ? circleTextColor
                          : note === root
                          ? "#5B9CC0"
                          : scaleNotes.includes(note)
                          ? circleTextColor
                          : "#A0A0A0",
                    },
                  ]}
                >
                  {note}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  noteContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  text: {
    width: 50,
    height: 50,
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});
