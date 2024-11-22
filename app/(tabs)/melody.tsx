import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useContext } from "react";
import { ChordContext } from "@/ChordContext";
import { MelodyParts } from "@/components/MelodyParts";

export default function melodyPage() {
  const { chordProgression, scaleNotes } = useContext(ChordContext);
  const bg = Colors.dark.background;
  console.log("scaleNotes", scaleNotes);
  let melodyNotes = [3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3];

  console.log("melodyNotes", melodyNotes);
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {chordProgression.length === 0 ? (
        <ThemedText type="subtitle">コードが選択されていません</ThemedText>
      ) : (
        <View>
          <View style={styles.chordContainer}>
            <ThemedText style={[styles.notesList, { color: bg }]}>
              AA
            </ThemedText>
            {chordProgression.map((chord, index) => (
              <ThemedText key={`${chord}-${index}`}>
                {scaleNotes && scaleNotes[chord] ? scaleNotes[chord] : "N/A"}
              </ThemedText>
            ))}
          </View>

          {melodyNotes.map((index) => {
            return (
              <View style={{ flexDirection: "row" }}>
                <ThemedText style={styles.notesList}>
                  {scaleNotes && scaleNotes[index]}
                </ThemedText>
                <View style={{ flexDirection: "row" }}>
                  {chordProgression.map((index) => {
                    return <MelodyParts />;
                  })}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  chordContainer: {
    flexDirection: "row",
  },
  notesList: {
    width: 30,
  },
});
