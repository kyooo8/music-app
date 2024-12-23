// useMusicPlayer.ts
import { useContext, useState } from "react";
import { MusicContext } from "@/context/MusicContext";
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
    shouldContinueRef,
    setPlaying,
  } = useContext(MusicContext);

  // 再生するパートのオプションをState管理
  const [playMelodyOnly, setPlayMelodyOnly] = useState(false);
  const [playBassOnly, setPlayBassOnly] = useState(false);
  const [playDramOnly, setPlayDramOnly] = useState(false);
  const [playMelodyAndBass, setPlayMelodyAndBass] = useState(false);

  const getPlayOptions = () => {
    if (playMelodyOnly) {
      return { playMelody: true, playBass: false, playDram: false };
    } else if (playBassOnly) {
      return { playMelody: false, playBass: true, playDram: false };
    } else if (playDramOnly) {
      return { playMelody: false, playBass: false, playDram: true };
    } else if (playMelodyAndBass) {
      return { playMelody: true, playBass: true, playDram: false };
    }
    return { playMelody: true, playBass: true, playDram: true };
  };

  const play = async () => {
    setPlaying(true);
    shouldContinueRef.current = true;

    try {
      await playMusic(
        {
          root,
          bpm,
          scaleType,
          scaleNotes: Object.fromEntries(scaleNotes.map((n, i) => [i, n])),
          chordProgression: chordProgression || {},
          melody: melody || {},
          bass: bass || {},
          dram: dram || {},
          sortedMelodyNotes: Object.fromEntries(
            sortedMelodyNotes.map((n, i) => [i, n])
          ),
        },
        () => shouldContinueRef.current,
        getPlayOptions()
      );
    } catch (err) {
      console.log("Playback error:", err);
    } finally {
      setPlaying(true);
    }
  };

  const stop = () => {
    shouldContinueRef.current = false;
    setPlaying(false);
  };

  return {
    play,
    stop,
    setPlayMelodyOnly,
    setPlayBassOnly,
    setPlayDramOnly,
    setPlayMelodyAndBass,
  };
}
