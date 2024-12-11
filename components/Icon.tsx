import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import fontData from "../assets/fonts/icomoon.ttf";
import fontSelection from "../assets/fonts/selection.json";
import { ViewStyle } from "react-native";

const CustomIcon = createIconSetFromIcoMoon(
  fontSelection,
  "IcoMoon",
  "icomoon.ttf"
);

type Glyph = (typeof fontSelection.icons)[number];
export type IconName = Glyph["properties"]["name"];

interface Props {
  name: IconName;
  size: number;
  color: string;
  style?: ViewStyle;
}

export const Icon = (props: Props) => {
  const [fontLoaded] = useFonts({ IcoMoon: fontData });
  if (!fontLoaded) {
    return null;
  }
  return (
    <CustomIcon
      name={`${props.name}`}
      size={props.size}
      color={`${props.color}`}
    />
  );
};
