// PlayBtn.tsx
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Icon } from "./Icon";
import { useChordPlayer } from "@/hooks/useChordPlayer";
import { Colors } from "@/constants/Colors";

export const PlayBtn = () => {
  const { playing, play, stop } = useChordPlayer();
  const bg = Colors.dark.circle;
  return (
    <View>
      {playing ? (
        <TouchableOpacity onPress={stop}>
          <Icon name="stop" size={48} color={bg} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={play}>
          <Icon name="play" size={48} color={bg} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
