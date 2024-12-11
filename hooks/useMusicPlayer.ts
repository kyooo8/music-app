// useMusicPlayer.ts
import { useContext, useState, useRef } from "react";
import { ChordContext } from "@/MusicContext";
import { playMusic } from "./playMusicLogic";

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
  } = useContext(ChordContext);

  const [playing, setPlaying] = useState(false);
  const shouldContinueRef = useRef(false); // 再生中フラグをrefで管理

  const play = async () => {
    if (!root || !chordProgression || !melody || !bass || !dram) {
      console.log("Not enough data to play");
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
          scaleNotes: scaleNotes, // ChordContext から取得したものを渡す
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
