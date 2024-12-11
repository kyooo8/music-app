// useChordPlayer.ts
import { useContext, useState } from "react";
import { ChordContext } from "@/MusicContext";
import { playMusic } from "./playMusicLogic";

export function useChordPlayer() {
  const {
    root,
    bpm,
    scaleType,
    chordProgression,
    melody,
    bass,
    dram,
    sortedMelodyNotes,
  } = useContext(ChordContext);
  const [playing, setPlaying] = useState(false);

  const play = async () => {
    if (!root || !chordProgression || !melody || !bass || !dram) {
      console.log("Not enough data to play");
      return;
    }

    setPlaying(true);
    try {
      await playMusic(
        {
          root,
          bpm,
          scaleType,
          scaleNotes: {}, // scaleNotesが必要ならここで設定
          chordProgression,
          melody,
          bass,
          dram,
          // sortedMelodyNotesをオブジェクト化
          sortedMelodyNotes: Object.fromEntries(
            sortedMelodyNotes.map((n, i) => [i, n])
          ),
        },
        () => playing // playingの状態をクロージャで参照
      );
    } catch (err) {
      console.log("Playback error:", err);
    } finally {
      // 再生終了時またはstop時にここへ
      setPlaying(false);
    }
  };

  const stop = () => {
    // playMusic内でshouldContinue()がfalseになるまで待って終了
    setPlaying(false);
  };

  return { playing, play, stop };
}
