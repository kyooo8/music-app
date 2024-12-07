// hooks/useChordPlayer.ts
import { useState, useRef, useContext, useCallback } from "react";
import { Alert } from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { ChordContext } from "@/ChordContext";

export const useChordPlayer = () => {
  const { scaleNotes, chordProgression, bpm } = useContext(ChordContext);
  const [playing, setPlaying] = useState(false);

  // ループ再生を停止するためのフラグ
  const isCancelled = useRef(false);

  // 現在再生中の音声オブジェクトを保持
  const currentSound = useRef<Audio.Sound | null>(null);

  // 音声ファイルのマッピング
  const soundFiles: { [key: string]: any } = {
    C: require("../assets/sounds/C.wav"),
    // "C#": require("../assets/sounds/Csharp.wav"),
    D: require("../assets/sounds/D.wav"),
    // "D#": require("../assets/sounds/Dsharp.wav"),
    E: require("../assets/sounds/E.wav"),
    F: require("../assets/sounds/F.wav"),
    // "F#": require("../assets/sounds/Fsharp.wav"),
    G: require("../assets/sounds/G.wav"),
    // "G#": require("../assets/sounds/Gsharp.wav"),
    A: require("../assets/sounds/A.wav"),
    // "A#": require("../assets/sounds/Asharp.wav"),
    B: require("../assets/sounds/B.wav"),
  };

  // BPMに基づく遅延時間の計算
  const calculateDelay = () => {
    if (!bpm) return 500; // デフォルトの遅延
    const beatDuration = 60000 / bpm; // 1ビートのミリ秒
    return beatDuration / 2; // 1/2ビートの遅延
  };

  const play = useCallback(async () => {
    if (!scaleNotes || chordProgression.length === 0) {
      Alert.alert("エラー", "スケールノートまたはコード進行がありません");
      return;
    }

    setPlaying(true);
    isCancelled.current = false;

    const delay = calculateDelay();

    try {
      while (!isCancelled.current) {
        for (const chordIndex of chordProgression) {
          if (isCancelled.current) {
            console.log("再生がキャンセルされました");
            break;
          }

          const note = scaleNotes[chordIndex];
          if (!note) {
            console.warn(
              `スケールノートに存在しないインデックス: ${chordIndex}`
            );
            continue;
          }

          const sound = soundFiles[note];
          if (!sound) {
            console.warn(`音声ファイルが見つかりません: ${note}`);
            continue;
          }

          const soundObject = new Audio.Sound();
          currentSound.current = soundObject;

          try {
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
          } catch (error) {
            console.error(
              `音声ファイルの再生中にエラーが発生しました: ${error}`
            );
          } finally {
            await soundObject.unloadAsync();
            currentSound.current = null;
          }

          // 各音の間に遅延を挿入
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    } catch (error) {
      console.error("コード進行の再生中にエラーが発生しました:", error);
    } finally {
      setPlaying(false);
    }
  }, [scaleNotes, chordProgression, bpm, soundFiles]);

  const stop = useCallback(async () => {
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
  }, [playing]);

  return { playing, play, stop };
};
