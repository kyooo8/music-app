// MusicContext.tsx
import { createContext, useState, useEffect, useRef, useContext } from "react";
import { useLocalSearchParams } from "expo-router";
import { Project } from "../types/project";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MusicContextType,
  ScaleType,
  ChordProgressionData,
  MelobassData,
  DramData,
} from "../types/music";
import { LoginContext } from "@/context/LoginContext";

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
  const shouldContinueRef = useRef(false);

  const { isLogin } = useContext(LoginContext);

  const fetchFromAsyncStorage = async (projectId: string) => {
    try {
      const storedData = await AsyncStorage.getItem("projects");
      const projects = storedData ? JSON.parse(storedData) : [];
      const localProject = projects.find((p: Project) => p.id === projectId);

      if (localProject) {
        setProject(localProject);
      } else {
        console.log("ローカルストレージに対応するプロジェクトが見つかりません");
      }
    } catch (error) {
      console.error("AsyncStorage取得エラー:", error);
    }
  };

  useEffect(() => {
    if (!id) return;

    if (isLogin && auth.currentUser) {
      const ref = doc(db, `users/${auth.currentUser.uid}/projects`, String(id));
      const unsubscribe = onSnapshot(ref, (docSnap) => {
        if (!docSnap.exists()) {
          console.log("Doc not found");
          return;
        }
        const data = docSnap.data() as Project;
        setProject({
          id: docSnap.id,
          title: data.title,
          description: data.description,
          root: data.root,
          bpm: data.bpm,
          scaleType: data.scaleType,
          chordProgression: data.chordProgression || null,
          melody: data.melody || null,
          bass: data.bass || null,
          dram: data.dram || null,
          updatedAt: data.updatedAt,
        });
      });

      return () => unsubscribe();
    } else {
      fetchFromAsyncStorage(String(id));
    }
  }, [auth.currentUser, id, isLogin]);

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

    const part1 = sortNotes.slice(10, 12);
    const part2 = sortNotes;
    const part3 = sortNotes.slice(0, 2);

    const extendedNotes = [...part1, ...part2, ...part3];

    const calculatedNotes = extendedNotes.map((note, index) => {
      let defaultOctave = 2;
      const plus = Math.floor((index + rootIndex + 10) / 12);
      const octave = defaultOctave + plus;
      return {
        name: note,
        index,
        octave,
      };
    });

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
