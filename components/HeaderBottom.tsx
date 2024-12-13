import { View, StyleSheet } from "react-native";

import { PlayBtn } from "./PlayBtn";
import { Bpm } from "./Bpm";
import { ToggleButton } from "./ToggleBtn";

export const HeaderBottom = () => {
  return (
    <View style={styles.settingContainer}>
      <View style={{ position: "absolute", left: 10 }}>
        <Bpm />
        <ToggleButton />
      </View>
      <PlayBtn />
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    position: "relative",
    width: "100%",
    marginTop: 16,
  },
});
