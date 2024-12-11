import { Timestamp } from "firebase/firestore";
import {
  ChordProgressionData,
  DramData,
  MelobassData,
  ScaleType,
} from "@/types/music";

export interface Project {
  id: string;
  title: string;
  description: string;
  root: string | null;
  bpm: number;
  scaleType: ScaleType;
  chordProgression?: ChordProgressionData;
  melody?: MelobassData;
  bass?: MelobassData;
  dram?: DramData;
  updatedAt: Timestamp;
}
