import { View, StyleSheet } from "react-native";
import { Bpm } from "./Bpm";
import { ToggleButton } from "./ToggleBtn";

export const HeaderBottom = () => {
  return (
    <View style={styles.settingContainer}>
      <View>
        <Bpm />
        <ToggleButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    marginTop: 30,
  },
});
