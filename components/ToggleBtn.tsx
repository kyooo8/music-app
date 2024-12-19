import { useState, useContext } from "react";
import { MusicContext } from "@/context/MusicContext";
import { Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { ChordProgressionData } from "@/types/music";

export const ToggleButton = () => {
  const {
    root,
    scaleNotes,
    scaleType,
    setScaleType,
    isEnabled,
    setIsEnabled,
    chordProgression,
    setChordProgression,
  } = useContext(MusicContext);

  const togglePosition = useState(new Animated.Value(isEnabled ? 1 : 0))[0];

  const toggleSwitch = () => {
    const newIsEnabled = !isEnabled;
    setIsEnabled(newIsEnabled);
    setScaleType(newIsEnabled ? "マイナー" : "メジャー"); // トグル後の状態に基づいて設定

    Animated.timing(togglePosition, {
      toValue: newIsEnabled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (chordProgression && root) {
      // 新しい chordProgression オブジェクトを作成
      const updatedChordProgression: ChordProgressionData = {
        ...chordProgression,
      };

      Object.keys(updatedChordProgression).forEach((key) => {
        const chord = updatedChordProgression[parseInt(key)];
        // root と一致するコードの shape を更新
        if (scaleNotes[chord.chord] === root) {
          updatedChordProgression[parseInt(key)] = {
            ...chord,
            shape: newIsEnabled ? "m" : "major",
          };
        }
      });

      setChordProgression(updatedChordProgression);
    }
  };

  return (
    <TouchableOpacity onPress={toggleSwitch} style={styles.container}>
      <Animated.View
        style={[
          styles.switch,
          {
            backgroundColor: isEnabled ? "#81b0ff" : "#767577",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [
                {
                  translateX: togglePosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, 54], // 左端から右端への移動
                  }),
                },
              ],
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              left: isEnabled ? 5 : undefined,
              right: isEnabled ? undefined : 5,
            },
          ]}
        >
          {scaleType}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  switch: {
    width: 85,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    position: "relative",
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ffffff",
    position: "absolute",
    top: 2,
  },
  text: {
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
