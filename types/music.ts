export type ScaleType = "メジャー" | "マイナー";
type NoteDuration = "whole" | "half" | "quarter" | "eighth" | "sixteenth";
export type NoteData = { relativePos: number; duration: NoteDuration } | null;
export type MelobassData = {
  [measure: number]: {
    [beat: number]: NoteData;
  };
} | null;

export type DramData = {
  [measure: number]: {
    [instrument: number]: {
      [step: number]: boolean;
    };
  };
} | null;

export type ChordItem = { chord: number; shape: string };

export type ChordProgressionData = {
  [index: number]: ChordItem;
} | null;

export interface MusicContextType {
  id: string;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  notes: string[];
  root: string | null;
  setRoot: React.Dispatch<React.SetStateAction<string | null>>;
  bpm: number;
  setBpm: React.Dispatch<React.SetStateAction<number>>;
  scaleType: ScaleType;
  setScaleType: React.Dispatch<React.SetStateAction<ScaleType>>;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
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