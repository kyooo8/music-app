// useMusicPlayer.ts
import { useContext } from "react";
import { MusicContext } from "@/context/MusicContext";
import { playMusic } from "./playMusicLogic";
import { Alert } from "react-native";

export function useMusicPlayer() {
  const {
    root,
    bpm,
    scaleType,
    scaleNotes,
    chordProgression,
    melody,
    bass,
    dram,
    sortedMelodyNotes,
    shouldContinueRef,
    playing,
    setPlaying,
  } = useContext(MusicContext);

  const play = async () => {
    if (!root || !chordProgression || !melody || !bass || !dram) {
      Alert.alert("全てのNoteを設定してください");
      return;
    }

    setPlaying(true);
    shouldContinueRef.current = true;

    try {
      await playMusic(
        {
          root,
          bpm,
          scaleType,
          scaleNotes: scaleNotes, // MusicContext から取得したものを渡す
          chordProgression,
          melody,
          bass,
          dram,
          sortedMelodyNotes: Object.fromEntries(
            sortedMelodyNotes.map((n, i) => [i, n])
          ),
        },
        () => shouldContinueRef.current // refから現在のshouldContinueを返す
      );
    } catch (err) {
      console.log("Playback error:", err);
    } finally {
      // 音源再生が終了した後にplayingをfalseへ
      setPlaying(false);
    }
  };

  const stop = () => {
    // playMusic内でshouldContinue()がfalseになるまで待って終了
    shouldContinueRef.current = false;
    setPlaying(false);
  };

  return { playing, play, stop };
}
