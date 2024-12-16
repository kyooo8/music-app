// useMusicPlayer.ts
import {
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { MusicContext } from "@/MusicContext";
import { playMusic } from "./playMusicLogic";
import { SortedMelodyNote } from "@/types/music";

interface UseMusicPlayer {
  playing: boolean;
  play: () => Promise<void>;
  stop: () => void;
}

export function useMusicPlayer(): UseMusicPlayer {
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
    playing,
    setPlaying,
    shouldContinueRef,
  } = useContext(MusicContext);

  // sortedMelodyNotes をオブジェクトにメモ化
  const sortedMelodyNotesObj = useMemo(() => {
    const obj: { [i: number]: SortedMelodyNote } = {};
    sortedMelodyNotes.forEach((n, i) => {
      obj[i] = {
        name: n.name,
        index: n.index,
        octave: n.octave,
      };
    });
    return obj;
  }, [sortedMelodyNotes]);

  // play 関数を useCallback でメモ化
  const play = useCallback(async () => {
    if (playing) {
      console.log("既に再生中です。");
      return;
    }

    if (!root || !chordProgression || !melody || !bass || !dram) {
      console.log("再生に必要なデータが不足しています。");
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
          scaleNotes,
          chordProgression,
          melody,
          bass,
          dram,
          sortedMelodyNotes: sortedMelodyNotesObj,
        },
        () => shouldContinueRef.current
      );
    } catch (err) {
      console.error("再生中にエラーが発生しました:", err);
    } finally {
      setPlaying(false);
    }
  }, [
    playing,
    root,
    bpm,
    scaleType,
    scaleNotes,
    chordProgression,
    melody,
    bass,
    dram,
    sortedMelodyNotesObj,
  ]);

  // stop 関数を useCallback でメモ化
  const stop = useCallback(() => {
    if (!playing) {
      console.log("再生が開始されていません。");
      return;
    }
    shouldContinueRef.current = false;
    setPlaying(false);
  }, [playing]);

  // コンポーネントのアンマウント時に再生を停止
  useEffect(() => {
    return () => {
      shouldContinueRef.current = false;
      setPlaying(false);
    };
  }, []);

  return { playing, play, stop };
}
