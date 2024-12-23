// PlayBtn.tsx
import React, { useContext, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
  Switch,
} from "react-native";
import { Icon } from "./Icon";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MusicContext } from "@/context/MusicContext";

export const PlayBtn = () => {
  const {
    play,
    stop,
    setPlayMelodyOnly,
    setPlayBassOnly,
    setPlayDramOnly,
    setPlayMelodyAndBass,
  } = useMusicPlayer();
  const { playing } = useContext(MusicContext);

  const bg = useThemeColor({}, "melody");
  const [modalVisible, setModalVisible] = useState(false);

  const [mOnly, setMOnly] = useState(false);
  const [bOnly, setBOnly] = useState(false);
  const [dOnly, setDOnly] = useState(false);
  const [mAndB, setMAndB] = useState(false);

  const applySettings = () => {
    setPlayMelodyOnly(mOnly);
    setPlayBassOnly(bOnly);
    setPlayDramOnly(dOnly);
    setPlayMelodyAndBass(mAndB);
    setModalVisible(false);
  };

  return (
    <View style={styles.play}>
      <TouchableOpacity
        onPress={playing ? stop : play}
        onLongPress={() => setModalVisible(true)}
      >
        <Icon name={playing ? "stop" : "play"} size={60} color={bg} />
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>再生するパートを選択:</Text>
            <View style={styles.optionRow}>
              <Text>メロディのみ</Text>
              <Switch
                value={mOnly}
                onValueChange={(v) => {
                  setMOnly(v);
                  if (v) {
                    setBOnly(false);
                    setDOnly(false);
                    setMAndB(false);
                  }
                }}
              />
            </View>
            <View style={styles.optionRow}>
              <Text>ベースのみ</Text>
              <Switch
                value={bOnly}
                onValueChange={(v) => {
                  setBOnly(v);
                  if (v) {
                    setMOnly(false);
                    setDOnly(false);
                    setMAndB(false);
                  }
                }}
              />
            </View>
            <View style={styles.optionRow}>
              <Text>ドラムのみ</Text>
              <Switch
                value={dOnly}
                onValueChange={(v) => {
                  setDOnly(v);
                  if (v) {
                    setMOnly(false);
                    setBOnly(false);
                    setMAndB(false);
                  }
                }}
              />
            </View>
            <View style={styles.optionRow}>
              <Text>メロディ&ベース</Text>
              <Switch
                value={mAndB}
                onValueChange={(v) => {
                  setMAndB(v);
                  if (v) {
                    setMOnly(false);
                    setBOnly(false);
                    setDOnly(false);
                  }
                }}
              />
            </View>

            <TouchableOpacity onPress={applySettings} style={styles.applyBtn}>
              <Text>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeBtn}
            >
              <Text>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  play: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  applyBtn: {
    padding: 10,
    backgroundColor: "lightblue",
    marginTop: 10,
    borderRadius: 5,
  },
  closeBtn: {
    padding: 10,
    backgroundColor: "lightgray",
    marginTop: 10,
    borderRadius: 5,
  },
});
