import React, { createContext, useState } from "react";

interface ChordContextType {
  chordProgression: number[];
  setChordProgression: React.Dispatch<React.SetStateAction<number[]>>;
  root: string | null;
  setRoot: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultChordContext: ChordContextType = {
  chordProgression: [],
  setChordProgression: () => {},
  root: null,
  setRoot: () => {},
};

export const ChordContext =
  createContext<ChordContextType>(defaultChordContext);

export const ChordProvider = ({ children }: { children: React.ReactNode }) => {
  const [root, setRoot] = useState<string | null>(null);
  const [chordProgression, setChordProgression] = useState<number[]>([]);

  return (
    <ChordContext.Provider
      value={{
        chordProgression,
        setChordProgression,
        root,
        setRoot,
      }}
    >
      {children}
    </ChordContext.Provider>
  );
};
