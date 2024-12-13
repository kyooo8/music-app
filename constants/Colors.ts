/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#5B9CC0";
// 0a7ea4
const tintColorDark = "#5B9CC0";

export const Colors = {
  light: {
    tab: "#ffffff",
    text: "#11181C",
    background: "#f2f2f2",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    circle: "#333333",
    circleText: "#ffffff",
    ChordProgression: "#ffffff",
    melody: "#C05B5B",
  },
  dark: {
    tab: "#202020",
    text: "#ECEDEE",
    background: "#000000",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    circle: "#f0f0f0",
    circleText: "#000000",
    ChordProgression: "#191919",
    melody: "#C05B5B",
  },
};
