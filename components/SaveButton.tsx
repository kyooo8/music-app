import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Button,
  TextInput,
  View,
} from "react-native";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { ChordContext } from "@/MusicContext";
import { ThemedText } from "./ThemedText";

export const SaveButton = () => {
  const {
    id,
    title,
    setTitle,
    description,
    setDescription,
    root,
    bpm,
    scaleType,
    chordProgression,
    melody,
    bass,
    dram,
  } = useContext(ChordContext);

  const [modalVisible, setModalVisible] = useState(false);

  // console.log("root", root);
  // console.log("bpm", bpm);
  // console.log("scaleType", scaleType);
  // console.log("chordProgression", chordProgression);
  // console.log("melody", melody);
  // console.log("bass", bass);
  // console.log("dram", dram);

  const handlePress = async (title: string, description: string) => {
    if (id) {
      const ref = doc(db, `users/${auth.currentUser?.uid}/projects`, id);
      await setDoc(ref, {
        title,
        description,
        root,
        bpm,
        scaleType,
        chordProgression,
        melody,
        bass,
        dram,
        updatedAt: Timestamp.fromDate(new Date()),
      }).catch((e) => {
        console.log("save error", e);
      });
    } else {
      await addDoc(collection(db, `users/${auth.currentUser?.uid}/projects`), {
        title,
        description,
        root,
        bpm,
        scaleType,
        chordProgression,
        melody,
        bass,
        dram,
        updatedAt: Timestamp.fromDate(new Date()),
      }).catch((error) => {
        console.log("add error", error);
      });
    }

    router.replace("/");
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <TouchableOpacity onPress={openModal}>
      <Text style={styles.text}>保存</Text>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackground} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              autoCapitalize="none"
              placeholder="プロジェクト名"
            />
            <TextInput
              style={styles.textInput}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
              }}
              autoCapitalize="none"
              placeholder="説明"
            />
            <Button
              title="保存"
              onPress={() => {
                handlePress(title, description);
              }}
            />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <ThemedText>Close Modal</ThemedText>
          </TouchableOpacity>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 24,
    color: "rgba(255,255,255,0.7)",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // 半透明な背景
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  textInput: {
    backgroundColor: "#ffffff",
    padding: 5,
    margin: 4,
  },
  closeButton: {
    backgroundColor: "#5B9CC0",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
