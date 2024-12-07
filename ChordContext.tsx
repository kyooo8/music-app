import React, { createContext, useState, useEffect } from "react";

export type ScaleType = "メジャー" | "マイナー";

interface ChordContextType {
  notes: string[];
  root: string | null;
  setRoot: React.Dispatch<React.SetStateAction<string | null>>;
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
  scaleType: ScaleType;
  setScaleType: React.Dispatch<React.SetStateAction<ScaleType>>;
  scaleNotes: string[] | null;
  setScaleNotes: React.Dispatch<React.SetStateAction<string[] | null>>;
  chordProgression: number[];
  setChordProgression: React.Dispatch<React.SetStateAction<number[]>>;
  melody: number[][];
  setMelody: React.Dispatch<React.SetStateAction<number[][]>>;
  sortedMelodyNotes: { name: string; index: number }[];
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultChordContext: ChordContextType = {
  notes: [""],
  root: null,
  setRoot: () => {},
  bpm: 100,
  setBpm: () => {},
  scaleType: "メジャー",
  setScaleType: () => {},
  scaleNotes: null,
  setScaleNotes: () => {},
  chordProgression: [],
  setChordProgression: () => {},
  melody: [[]],
  setMelody: () => {},
  sortedMelodyNotes: [],
  playing: false,
  setPlaying: () => {},
};

export const ChordContext =
  createContext<ChordContextType>(defaultChordContext);

export const ChordProvider = ({ children }: { children: React.ReactNode }) => {
  const notes: string[] = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const [root, setRoot] = useState<string | null>(null);
  const [bpm, setBpm] = useState(100);
  const [scaleType, setScaleType] = useState<ScaleType>("メジャー");
  const [scaleNotes, setScaleNotes] = useState<string[] | null>(null);
  const [chordProgression, setChordProgression] = useState<number[]>([]);
  const [melody, setMelody] = useState<number[][]>([[]]);
  const [sortedMelodyNotes, setSortedMelodyNotes] = useState<
    { name: string; index: number }[]
  >([]);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!root || notes.length === 0) {
      setSortedMelodyNotes([]);
      return;
    }

    const rootIndex = notes.indexOf(root);
    const sortNotes = [...notes.slice(rootIndex), ...notes.slice(0, rootIndex)];
    const calculatedNotes = [
      ...sortNotes.slice(8, 11),
      ...sortNotes,
      ...sortNotes.slice(0, 3),
    ].map((note, index) => ({ name: note, index }));

    // 状態が変更された場合にのみ更新
    setSortedMelodyNotes((prev) => {
      const isSame =
        prev.length === calculatedNotes.length &&
        prev.every((note, i) => note.name === calculatedNotes[i].name);
      if (isSame) return prev; // 同じ状態なら更新しない

      return calculatedNotes;
    });
  }, [root, notes]);

  return (
    <ChordContext.Provider
      value={{
        notes,
        root,
        setRoot,
        bpm,
        setBpm,
        scaleType,
        setScaleType,
        scaleNotes,
        setScaleNotes,
        chordProgression,
        setChordProgression,
        melody,
        setMelody,
        sortedMelodyNotes,
        playing,
        setPlaying,
      }}
    >
      {children}
    </ChordContext.Provider>
  );
};
