import { View, StyleSheet } from "react-native";

import { PlayBtn } from "./PlayBtn";
import { Bpm } from "./Bpm";
import { ToggleButton } from "./ToggleBtn";

interface Props {
  input?: boolean;
}

export const HeaderBottom = ({ input }: Props) => {
  return (
    <View style={styles.settingContainer}>
      <PlayBtn />
      {input ?? (
        <View style={{ position: "absolute", right: 10 }}>
          <Bpm />
          <ToggleButton />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 16,
  },
});
