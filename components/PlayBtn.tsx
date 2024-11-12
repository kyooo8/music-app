// components/PlayBtn.tsx
import { TouchableOpacity, Alert, View } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import Icon from "./Icon";
import { useState, useRef } from "react";

interface Props {
  scaleNotes: string[] | null;
  chordProgression?: number[];
}

export function PlayBtn({ scaleNotes, chordProgression }: Props) {
  const [playing, setPlaying] = useState(false);

  // 再生プロセスをキャンセルするためのフラグ
  const isCancelled = useRef(false);

  // 現在再生中の音声オブジェクトを保持するためのリファレンス
  const currentSound = useRef<Audio.Sound | null>(null);

  // 音声ファイルのマッピング（相対パスを使用）
  const soundFiles: { [key: string]: any } = {
    C: require("../assets/sounds/C.wav"),
    D: require("../assets/sounds/D.wav"),
    E: require("../assets/sounds/E.wav"),
    F: require("../assets/sounds/F.wav"),
    G: require("../assets/sounds/G.wav"),
    A: require("../assets/sounds/A.wav"),
    B: require("../assets/sounds/B.wav"),
  };

  // 再生関数
  const playChordProgression = async () => {
    if (!scaleNotes || !chordProgression || chordProgression.length === 0) {
      Alert.alert("エラー", "スケールノートまたはコード進行がありません");
      return;
    }

    setPlaying(true);
    isCancelled.current = false;

    try {
      for (const chordIndex of chordProgression) {
        if (isCancelled.current) {
          console.log("再生がキャンセルされました");
          break;
        }

        const note = scaleNotes[chordIndex];
        if (!note) {
          console.warn(`スケールノートに存在しないインデックス: ${chordIndex}`);
          continue;
        }

        const soundObject = new Audio.Sound();
        currentSound.current = soundObject;

        try {
          const sound = soundFiles[note];
          if (!sound) {
            console.warn(`音声ファイルが見つかりません: ${note}`);
            continue;
          }

          await soundObject.loadAsync(sound);
          await soundObject.playAsync();

          // 再生が完了するまで待機
          await new Promise<void>((resolve, reject) => {
            soundObject.setOnPlaybackStatusUpdate(
              (status: AVPlaybackStatus) => {
                if (status.isLoaded) {
                  if (status.didJustFinish) {
                    resolve();
                  }
                } else if (status.error) {
                  reject(status.error);
                }
              }
            );
          });
        } catch (loadError) {
          console.error(
            `音声ファイルの再生中にエラーが発生しました: ${loadError}`
          );
        } finally {
          // リソースを解放
          await soundObject.unloadAsync();
          currentSound.current = null;
        }

        // 各音の間に500msの遅延を挿入（必要に応じて調整）
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } catch (error) {
      console.error("コード進行の再生中にエラーが発生しました:", error);
    } finally {
      setPlaying(false);
    }
  };

  // 停止関数
  const stopChordProgression = async () => {
    if (playing) {
      isCancelled.current = true;
      if (currentSound.current) {
        try {
          await currentSound.current.stopAsync();
          await currentSound.current.unloadAsync();
          currentSound.current = null;
        } catch (error) {
          console.error("再生の停止中にエラーが発生しました:", error);
        }
      }
      setPlaying(false);
    }
  };

  return (
    <View style={{ position: "absolute", left: 40, top: 10 }}>
      {playing ? (
        <TouchableOpacity onPress={stopChordProgression}>
          <Icon name={"stop"} size={48} color={"black"} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={playChordProgression}>
          <Icon name={"play"} size={48} color={"black"} />
        </TouchableOpacity>
      )}
    </View>
  );
}
