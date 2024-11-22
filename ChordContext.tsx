import React, { createContext, useState } from "react";

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
      }}
    >
      {children}
    </ChordContext.Provider>
  );
};
