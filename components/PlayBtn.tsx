// PlayBtn.tsx
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { Icon } from "./Icon";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { Colors } from "@/constants/Colors";

export const PlayBtn = () => {
  const { playing, play, stop } = useMusicPlayer();
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
