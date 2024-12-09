import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ExternalLink } from "@/components/ExternalLink";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ParallaxScrollView>
      <ThemedText type="default">　テキストサンプルです</ThemedText>
      <ThemedText type="title">　テキストサンプルです</ThemedText>
      <ThemedText type="defaultSemiBold">　テキストサンプルです</ThemedText>
      <ThemedText type="subtitle">　テキストサンプルです</ThemedText>
      <ThemedText type="link">　テキストサンプルです</ThemedText>

      <ExternalLink
        href="/(tabs)/chord"
        onPress={() => router.push("/(tabs)/chord")}
      >
        code
      </ExternalLink>
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
