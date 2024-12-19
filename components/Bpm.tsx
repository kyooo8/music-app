import { useEffect, useState, useContext } from "react";
import { View, TextInput, StyleSheet, Keyboard } from "react-native";

import { ThemedText } from "./ThemedText";
import { MusicContext } from "@/context/MusicContext";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";

export const Bpm = () => {
  const { bpm, setBpm } = useContext(MusicContext);
  const textColor = useThemeColor({}, "text");

  const [tempValue, setTempValue] = useState(String(bpm));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (text: string) => {
    setTempValue(text);
    setErrorMessage(null);
  };

  const handleSubmitEditing = () => {
    const num = parseInt(tempValue);

    if (!isNaN(num) && num >= 60 && num <= 300) {
      setBpm(num);
      Keyboard.dismiss();
    } else {
      setErrorMessage("60〜300の範囲で入力してください");
    }
  };

  useEffect(() => {
    setTempValue(String(bpm));
  }, [bpm]);

  return (
    <View style={styles.input}>
      <ThemedText type="small">BPM: </ThemedText>
      <TextInput
        keyboardType="numeric"
        returnKeyType="done"
        onChangeText={handleChange}
        onSubmitEditing={handleSubmitEditing}
        blurOnSubmit={true}
        value={tempValue}
        style={[styles.textInput, styles.defaultSemiBold, { color: textColor }]}
      />
      {errorMessage && <ThemedText type="error">{errorMessage}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  defaultSemiBold: {
    fontWeight: "600",
  },
  textInput: {
    height: "100%",
    textAlign: "center",
  },
});
