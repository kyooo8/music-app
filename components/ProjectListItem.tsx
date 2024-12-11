import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { ThemedText } from "./ThemedText";
import { Project } from "@/types/project";

interface Props {
  project: Project;
}

export const ProjecctListItem = (props: Props) => {
  const { project } = props;
  const { updatedAt } = project;
  if (updatedAt === null) {
    return null;
  }
  const dateString = project.updatedAt.toDate().toLocaleString("ja-JP");
  return (
    <Link
      href={{ pathname: `/(tabs)/chord`, params: { id: project.id } }}
      replace
      asChild
    >
      <TouchableOpacity style={styles.musicContainer}>
        <View style={styles.leftBox}>
          <ThemedText type="title">{project.title}</ThemedText>
          <View>
            <ThemedText>BPM : {project.bpm}</ThemedText>
            <ThemedText>key : {project.root}</ThemedText>
          </View>
        </View>
        <View>
          <ThemedText numberOfLines={2} style={{ marginBottom: 30 }}>
            {dateString}
          </ThemedText>
          <ThemedText>{project.description}</ThemedText>
        </View>
        <View style={styles.bar}></View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
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
});
