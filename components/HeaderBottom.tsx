import { View, StyleSheet } from "react-native";

import { PlayBtn } from "./PlayBtn";
import { Bpm } from "./Bpm";
import { ToggleButton } from "./ToggleBtn";

export const HeaderBottom = () => {
  return (
    <View style={styles.settingContainer}>
      <PlayBtn />
      <View style={{ position: "absolute", right: 10 }}>
        <Bpm />
        <ToggleButton />
      </View>
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
