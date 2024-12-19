// // playMusicLogic.ts
import { Audio } from "expo-av";
import {
  melodySoundsMap,
  bassSoundsMap,
  dramSoundsMap,
} from "@/constants/soundMaps";
import { NoteData } from "@/types/music";

export const loadMelodySound = async (noteName: string) => {
  const soundFile = melodySoundsMap[noteName];
  if (!soundFile) {
    console.log(`Melody sound not found: ${noteName}`);
    return null;
  }
  const { sound } = await Audio.Sound.createAsync(soundFile);
  return sound;
};

const loadBassSound = async (noteName: string) => {
  const soundFile = bassSoundsMap[noteName];
  if (!soundFile) {
    console.log(`Bass sound not found: ${noteName}`);
    return null;
  }
  const { sound } = await Audio.Sound.createAsync(soundFile);
  return sound;
};

export const loadDramSound = async (instrumentName: string) => {
  const soundFile = dramSoundsMap[instrumentName];
  if (!soundFile) {
    console.log(`Dram sound not found: ${instrumentName}`);
    return null;
  }
  const { sound } = await Audio.Sound.createAsync(soundFile);
  return sound;
};

const getDramInstrumentName = (instrumentIndex: number): string => {
  return dramInstruments[instrumentIndex] || "snare";
};

interface ChordProgressionItem {
  chord: number;
  shape: string;
}

interface SortedMelodyNote {
  name: string;
  index: number;
  octave: number;
}
interface MusicData {
  root: string;
  bpm: number;
  scaleType: string;
  scaleNotes: { [index: number]: string };
  chordProgression: { [index: number]: ChordProgressionItem };
  melody: { [measure: number]: { [beat: number]: NoteData } };
  bass: { [measure: number]: { [beat: number]: NoteData } };
  dram: {
    [measure: number]: { [instrument: number]: { [step: number]: boolean } };
  };
  sortedMelodyNotes: { [i: number]: SortedMelodyNote };
}

export const dramInstruments = [
  "hand-clap",
  "high-tom",
  "low-tom",
  "clash",
  "ride",
  "open-hihat",
  "closed-hihat",
  "snare",
  "bass-drum",
  "pedal-hihat",
];

export const fadeOutSound = async (sound: Audio.Sound, duration: number) => {
  const steps = 10; // フェードアウトを10ステップで行う
  const stepDuration = duration / steps; // 各ステップの間隔(ms)
  let currentVolume = 1.0;

  for (let i = 0; i <= steps; i++) {
    const volume = 1.0 - i / steps;
    await sound.setVolumeAsync(volume);
    await new Promise((resolve) => setTimeout(resolve, stepDuration));
  }

  // フェードアウト終了後に停止と解放
  await sound.stopAsync();
  await sound.unloadAsync();
};

const convertRelativeToNote = (
  relativePos: number,
  sortedMelodyNotes: { [i: number]: SortedMelodyNote }
): string | null => {
  const noteData = sortedMelodyNotes[relativePos];
  return noteData ? noteData.name : null; // ここでは"A#"などオクターブなし返す
};

// オクターブ計算関数: relativePosからオクターブ付き音名を作成
export function getOctaveAdjustedNote(
  noteName: string,
  relativePos: number,
  isBass: boolean,
  sortedMelody: { [i: number]: SortedMelodyNote }
): string {
  let baseOctave = isBass ? 2 : 0;
  const octave = sortedMelody[relativePos].octave - baseOctave;
  return `${octave}${noteName}`; // "3A#", "2C"など
}

export async function playMusic(
  data: MusicData,
  shouldContinue: () => boolean
) {
  const { bpm, melody, bass, dram, sortedMelodyNotes } = data;

  const melodySounds: Record<string, Audio.Sound> = {};
  const bassSounds: Record<string, Audio.Sound> = {};
  const dramSounds: Record<string, Audio.Sound> = {};

  const beatDuration = (60 / bpm) * 1000; // quarter note
  const dramStepDuration = beatDuration / 4;
  const measureCount = Object.keys(dram).length;
  const melodyBeatsPerMeasure = 4;

  // 音声読み込み(メロディ)
  for (let measureStr in melody) {
    const measure = Number(measureStr);
    for (let beatStr in melody[measure]) {
      const beat = Number(beatStr);
      const noteObj = melody[measure][beat];
      if (noteObj && noteObj.relativePos !== null) {
        const baseNoteName = convertRelativeToNote(
          noteObj.relativePos,
          sortedMelodyNotes
        );
        if (baseNoteName) {
          const fullName = getOctaveAdjustedNote(
            baseNoteName,
            noteObj.relativePos,
            false,
            sortedMelodyNotes
          );
          if (!melodySounds[fullName]) {
            const sound = await loadMelodySound(fullName);
            if (sound) melodySounds[fullName] = sound;
          }
        }
      }
    }
  }

  // 音声読み込み(ベース)
  for (let measureStr in bass) {
    const measure = Number(measureStr);
    for (let beatStr in bass[measure]) {
      const beat = Number(beatStr);
      const noteObj = bass[measure][beat];
      if (noteObj && noteObj.relativePos !== null) {
        const baseNoteName = convertRelativeToNote(
          noteObj.relativePos,
          sortedMelodyNotes
        );
        if (baseNoteName) {
          const fullName = getOctaveAdjustedNote(
            baseNoteName,
            noteObj.relativePos,
            true,
            sortedMelodyNotes
          );
          // ベースはisBass=trueで1オクターブ低い設定
          if (!bassSounds[fullName]) {
            const sound = await loadBassSound(fullName);
            if (sound) bassSounds[fullName] = sound;
          }
        }
      }
    }
  }

  // 音声読み込み(ドラム)
  for (let measureStr in dram) {
    const measure = Number(measureStr);
    for (let instrumentStr in dram[measure]) {
      const instrument = Number(instrumentStr);
      for (let stepStr in dram[measure][instrument]) {
        const step = Number(stepStr);
        const isActive = dram[measure][instrument][step];
        if (isActive) {
          const instrumentName = getDramInstrumentName(instrument);
          if (!dramSounds[instrumentName]) {
            const sound = await loadDramSound(instrumentName);
            if (sound) dramSounds[instrumentName] = sound;
          }
        }
      }
    }
  }

  try {
    // 無限ループ
    while (shouldContinue()) {
      for (let measure = 0; measure < measureCount; measure++) {
        if (!shouldContinue()) break;
        for (let beat = 0; beat < melodyBeatsPerMeasure; beat++) {
          if (!shouldContinue()) break;

          const melodyNote = melody[measure]?.[beat];
          if (melodyNote && melodyNote.relativePos !== null) {
            const baseNoteName = convertRelativeToNote(
              melodyNote.relativePos,
              sortedMelodyNotes
            );
            if (baseNoteName && shouldContinue()) {
              const fullName = getOctaveAdjustedNote(
                baseNoteName,
                melodyNote.relativePos,
                false,
                sortedMelodyNotes
              );
              const sound = melodySounds[fullName];
              if (sound) {
                await sound.replayAsync();
              }
            }
          }

          const bassNote = bass[measure]?.[beat];
          if (bassNote && bassNote.relativePos !== null) {
            const baseNoteName = convertRelativeToNote(
              bassNote.relativePos,
              sortedMelodyNotes
            );
            if (baseNoteName && shouldContinue()) {
              const fullName = getOctaveAdjustedNote(
                baseNoteName,
                bassNote.relativePos,
                true,
                sortedMelodyNotes
              );
              const sound = bassSounds[fullName];
              if (sound) {
                await sound.replayAsync();
              }
            }
          }

          for (let stepInBeat = 0; stepInBeat < 4; stepInBeat++) {
            if (!shouldContinue()) break;
            const dramStep = beat * 4 + stepInBeat;
            if (dram[measure]) {
              for (let instrument = 0; instrument < 10; instrument++) {
                const isActive = dram[measure][instrument]?.[dramStep];
                if (isActive && shouldContinue()) {
                  const instrumentName = getDramInstrumentName(instrument);
                  const sound = dramSounds[instrumentName];
                  if (sound) {
                    await sound.replayAsync();
                  }
                }
              }
            }
            if (!shouldContinue()) break;
            await new Promise((resolve) =>
              setTimeout(resolve, dramStepDuration)
            );
          }
        }
      }
    }
  } catch (error) {
    console.log("Playback error:", error);
  } finally {
    // 終了時リソース解放
    Object.values(melodySounds).forEach((sound) => sound.unloadAsync());
    Object.values(bassSounds).forEach((sound) => sound.unloadAsync());
    Object.values(dramSounds).forEach((sound) => sound.unloadAsync());
  }
}
