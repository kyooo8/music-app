import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useContext } from "react";
import { ChordContext } from "@/ChordContext";

export const MelodyParts = () => {
  const { notes } = useContext(ChordContext);
  return (
    <View>
      {notes.map((note) => {
        return <ThemedText>{note}</ThemedText>;
      })}
    </View>
  );
};
