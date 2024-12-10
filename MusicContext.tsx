// MusicContext.tsx
import React, { createContext, useState, useEffect } from "react";

export type ScaleType = "メジャー" | "マイナー";

export type NoteData = { relativePos: number; duration: string } | null;
export type MelobassData = {
  [measure: number]: {
    [beat: number]: NoteData;
  };
} | null;

type DramData = {
  [measure: number]: {
    [instrument: number]: {
      [step: number]: boolean;
    };
  };
} | null;

export type ChordItem = { chord: number; shape: string };
type ChordProgressionData = {
  [index: number]: ChordItem;
} | null;

interface ChordContextType {
  notes: string[];
  root: string | null;
  setRoot: React.Dispatch<React.SetStateAction<string | null>>;
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
  scaleType: ScaleType;
  setScaleType: React.Dispatch<React.SetStateAction<ScaleType>>;
  scaleNotes: string[];
  setScaleNotes: React.Dispatch<React.SetStateAction<string[]>>;
  chordProgression: ChordProgressionData;
  setChordProgression: React.Dispatch<
    React.SetStateAction<ChordProgressionData>
  >;
  melody: MelobassData;
  setMelody: React.Dispatch<React.SetStateAction<MelobassData>>;
  bass: MelobassData;
  setBass: React.Dispatch<React.SetStateAction<MelobassData>>;
  sortedMelodyNotes: { name: string; index: number }[];
  dram: DramData;
  setDram: React.Dispatch<React.SetStateAction<DramData>>;
}

const defaultChordContext: ChordContextType = {
  notes: [""],
  root: null,
  setRoot: () => {},
  bpm: 100,
  setBpm: () => {},
  scaleType: "メジャー",
  setScaleType: () => {},
  scaleNotes: [],
  setScaleNotes: () => {},
  chordProgression: null,
  setChordProgression: () => {},
  melody: null,
  setMelody: () => {},
  bass: null,
  setBass: () => {},
  sortedMelodyNotes: [],
  dram: null,
  setDram: () => {},
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
  const [scaleNotes, setScaleNotes] = useState<string[]>([]);
  const [chordProgression, setChordProgression] =
    useState<ChordProgressionData>(null);
  const [melody, setMelody] = useState<MelobassData>(null);
  const [bass, setBass] = useState<MelobassData>(null);
  const [sortedMelodyNotes, setSortedMelodyNotes] = useState<
    { name: string; index: number }[]
  >([]);
  const [dram, setDram] = useState<DramData>(null);

  useEffect(() => {
    if (!root) return;
    if (notes.length === 0) {
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

    setSortedMelodyNotes((prev) => {
      const isSame =
        prev.length === calculatedNotes.length &&
        prev.every((note, i) => note.name === calculatedNotes[i].name);
      if (isSame) return prev;

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
        bass,
        setBass,
        sortedMelodyNotes,
        dram,
        setDram,
      }}
    >
      {children}
    </ChordContext.Provider>
  );
};
