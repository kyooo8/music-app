import { Image, StyleSheet, Platform } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ParallaxScrollView>
      <ThemedText type="default">　テキストサンプルです</ThemedText>
      <ThemedText type="title">　テキストサンプルです</ThemedText>
      <ThemedText type="defaultSemiBold">　テキストサンプルです</ThemedText>
      <ThemedText type="subtitle">　テキストサンプルです</ThemedText>
      <ThemedText type="link">　テキストサンプルです</ThemedText>

      <Link href="/(tabs)/chord" onPress={() => router.push("/(tabs)/chord")}>
        code
      </Link>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
