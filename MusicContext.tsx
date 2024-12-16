// MusicContext.tsx
import { createContext, useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { Project } from "./types/project";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import {
  MusicContextType,
  ScaleType,
  ChordProgressionData,
  MelobassData,
  DramData,
} from "./types/music";

const defaultMusicContext: MusicContextType = {
  id: "",
  title: "新規プロジェクト",
  setTitle: () => {},
  description: "",
  setDescription: () => {},
  notes: [""],
  root: null,
  setRoot: () => {},
  bpm: 100,
  setBpm: () => {},
  scaleType: "メジャー",
  isEnabled: false,
  setIsEnabled: () => {},
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
  playing: false,
  setPlaying: () => {},
  shouldContinueRef: false,
};

export const MusicContext =
  createContext<MusicContextType>(defaultMusicContext);

export const ChordProvider = ({ children }: { children: React.ReactNode }) => {
  const { id }: { id: string } = useLocalSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("新規プロジェクト");
  const [description, setDescription] = useState("");

  const [root, setRoot] = useState<string | null>(null);
  const [bpm, setBpm] = useState(100);
  const [scaleType, setScaleType] = useState<ScaleType>("メジャー");
  const [isEnabled, setIsEnabled] = useState(false);
  const [scaleNotes, setScaleNotes] = useState<string[]>([]);
  const [chordProgression, setChordProgression] =
    useState<ChordProgressionData>(null);
  const [melody, setMelody] = useState<MelobassData>(null);
  const [bass, setBass] = useState<MelobassData>(null);
  const [sortedMelodyNotes, setSortedMelodyNotes] = useState<
    { name: string; index: number; octave: number }[]
  >([]);
  const [dram, setDram] = useState<DramData>(null);
  const [playing, setPlaying] = useState(false);
  const shouldContinueRef = useRef(false); // グローバルで再生状態を管理

  useEffect(() => {
    if (auth.currentUser === null || !id) {
      return;
    }
    const ref = doc(db, `users/${auth.currentUser.uid}/projects`, String(id));

    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (!docSnap.exists()) {
        console.log("Doc not found");
        return;
      }
      const data = docSnap.data() as Project;
      const {
        title,
        description,
        root: docRoot,
        bpm: docBpm,
        scaleType: docScaleType,
        chordProgression: docChordProgression,
        melody: docMelody,
        bass: docBass,
        dram: docDram,
        updatedAt,
      } = data;

      setProject({
        id: docSnap.id,
        title,
        description,
        root: docRoot,
        bpm: docBpm,
        scaleType: docScaleType,
        chordProgression: docChordProgression || null,
        melody: docMelody || null,
        bass: docBass || null,
        dram: docDram || null,
        updatedAt,
      });
    });

    return () => unsubscribe();
  }, [auth.currentUser, id]);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setRoot(project.root);
      setBpm(project.bpm);
      setScaleType(project.scaleType);
      setChordProgression(
        project.chordProgression ? project.chordProgression : null
      );
      setMelody(project.melody ? project.melody : null);
      setBass(project.bass ? project.bass : null);
      setDram(project.dram ? project.dram : null);
    }
  }, [project]);

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

  useEffect(() => {
    if (!root) return;

    if (notes.length === 0) {
      setSortedMelodyNotes([]);
      return;
    }

    const rootIndex = notes.indexOf(root);
    const sortNotes = [...notes.slice(rootIndex), ...notes.slice(0, rootIndex)];

    const calculatedNotes = [
      ...sortNotes.slice(10, 12).map((note, index) => ({
        name: note,
        octave: 2,
        index,
      })),
      ...sortNotes.map((note, index) => ({
        name: note,
        octave: 3,
        index: index + 2,
      })),
      ...sortNotes.slice(0, 3).map((note, index) => ({
        name: note,
        octave: 4,
        index: index + sortNotes.length + 2,
      })),
    ];

    setSortedMelodyNotes((prev) => {
      const isSame =
        prev.length === calculatedNotes.length &&
        prev.every((note, i) => note.name === calculatedNotes[i].name);
      if (isSame) return prev;

      return calculatedNotes;
    });
  }, [root]);

  return (
    <MusicContext.Provider
      value={{
        id,
        title,
        setTitle,
        description,
        setDescription,
        notes,
        root,
        setRoot,
        bpm,
        setBpm,
        scaleType,
        setScaleType,
        isEnabled,
        setIsEnabled,
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
        playing,
        setPlaying,
        shouldContinueRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
