import { useState, useContext } from "react";
import { ChordContext } from "@/MusicContext";
import { Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

export const ToggleButton = () => {
  const { scaleType, setScaleType } = useContext(ChordContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const togglePosition = useState(new Animated.Value(0))[0];

  const toggleSwitch = () => {
    setIsEnabled((prev) => !prev);
    isEnabled ? setScaleType("メジャー") : setScaleType("マイナー");
    Animated.timing(togglePosition, {
      toValue: isEnabled ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
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
                    outputRange: [0, 54],
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
    left: 2,
    top: 1,
  },
  text: {
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
