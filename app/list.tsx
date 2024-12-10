import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function ListPage() {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <TouchableOpacity
          style={styles.musicContainer}
          onPress={() => router.replace("/(tabs)/chord")}
        >
          <View style={styles.leftBox}>
            <ThemedText type="title">サンプル</ThemedText>
            <View>
              <ThemedText>BPM : 120</ThemedText>
              <ThemedText>key : C</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText style={{ marginBottom: 30 }}>2024/10/27</ThemedText>
            <ThemedText>奇跡の音楽</ThemedText>
          </View>
        </TouchableOpacity>
        <View style={styles.bar}></View>
        <TouchableOpacity
          style={styles.musicContainer}
          onPress={() => router.replace("/(tabs)/chord")}
        >
          <View style={styles.leftBox}>
            <ThemedText type="title">サンプル</ThemedText>
            <View>
              <ThemedText>BPM : 120</ThemedText>
              <ThemedText>key : C</ThemedText>
            </View>
          </View>
          <View>
            <ThemedText style={{ marginBottom: 30 }}>2024/10/27</ThemedText>
            <ThemedText>奇跡の音楽</ThemedText>
          </View>
        </TouchableOpacity>
        <View style={styles.bar}></View>
      </View>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => router.replace("/(tabs)/chord")}
      >
        <ThemedText type="title">+</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.background,
    flex: 1,
  },
  listContainer: {
    marginTop: 30,
    flex: 1,
    width: "80%",
    marginInline: "auto",
  },
  musicContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 105,
  },
  leftBox: {
    justifyContent: "space-between",
  },
  bar: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginTop: 10,
    marginBottom: 30,
  },
  createBtn: {
    backgroundColor: Colors.dark.tint,
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    position: "absolute",
    right: 40,
    bottom: 40,
  },
});
