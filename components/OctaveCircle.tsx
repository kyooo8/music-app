import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useRef, useEffect, useContext } from "react";
import { ChordContext } from "@/ChordContext";
import { Colors } from "@/constants/Colors";

export function OctaveCircle() {
  const {
    notes,
    scaleNotes,
    setRoot,
    root,
    chordProgression,
    setChordProgression,
  } = useContext(ChordContext);
  const circleTextColor = Colors.dark.circleText;

  // ダブルタップの検出に使用
  const lastTap = useRef<number | null>(null);

  // rotationのアニメーション値
  const rotation = useRef(new Animated.Value(0)).current;

  // 前回のルート音のインデックスを保持
  const previousIndex = useRef<number>(notes.indexOf(root ? root : "C"));

  // 累積の回転角度を保持
  const accumulatedRotation = useRef(0);

  useEffect(() => {
    const currentIndex = notes.indexOf(root ? root : "C");
    const anglePerNote = 360 / notes.length;
    const angleDifference =
      ((currentIndex - previousIndex.current + notes.length) % notes.length) *
      anglePerNote;

    // 最短距離で回転するように調整
    let shortestAngle =
      angleDifference > 180 ? angleDifference - 360 : angleDifference;

    // 累積回転角度を更新
    accumulatedRotation.current -= shortestAngle;

    // 回転角度を更新
    Animated.timing(rotation, {
      toValue: accumulatedRotation.current,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 前回のインデックスを更新
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

  // ダブルタップの処理
  const handleDoubleTap = (note: string) => {
    const now = Date.now();
    if (lastTap.current && now - lastTap.current < 300) {
      // ダブルタップとみなす
      setRoot(note);
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]}>
        {notes.map((note, index) => {
          // 各音符の角度を計算
          const angle = (360 / notes.length) * index - 90;
          const rad = (angle * Math.PI) / 180;

          // xとyの位置を計算
          const x = 125 * Math.cos(rad);
          const y = 125 * Math.sin(rad);

          return (
            <TouchableOpacity
              key={note}
              onLongPress={() => {
                if (scaleNotes?.includes(note)) {
                  const newChordProgression = chordProgression.concat(
                    scaleNotes.indexOf(note)
                  );
                  if (newChordProgression.length <= 8) {
                    setChordProgression(newChordProgression);
                  } else {
                    alert("最大8個まで");
                  }
                } else if (!root) {
                  alert("ルートを選んで");
                } else {
                  alert("スケール外です");
                }
              }}
              onPress={() => handleDoubleTap(note)}
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
                        scaleNotes === null
                          ? circleTextColor
                          : note === root
                          ? "#5B9CC0" // ルート音の色
                          : scaleNotes.includes(note)
                          ? circleTextColor // 薄く表示する音の色
                          : "#A0A0A0", // デフォルトの色
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
}

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
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
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
