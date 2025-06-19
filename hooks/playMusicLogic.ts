// playMusicLogic.ts
import { Audio } from "expo-av";
import { melodySoundsMap, bassSoundsMap } from "@/constants/soundMaps";
import { NoteData } from "@/types/music";
import { createDrumPools, DrumPools, dramInstruments } from "./drumPool";

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
  root: string | null;
  bpm: number;
  scaleType: string;
  scaleNotes: { [index: number]: string };
  chordProgression: { [index: number]: ChordProgressionItem } | {};
  melody: { [measure: number]: { [beat: number]: NoteData } } | {};
  bass: { [measure: number]: { [beat: number]: NoteData } } | {};
  dram:
    | {
        [measure: number]: {
          [instrument: number]: { [step: number]: boolean };
        };
      }
    | {};
  sortedMelodyNotes: { [i: number]: SortedMelodyNote };
}

export const fadeOutSound = async (sound: Audio.Sound, duration: number) => {
  const steps = 10; // フェードアウトを行うステップ数
  const stepDuration = duration / steps; // 各ステップの間隔（ミリ秒）

  try {
    for (let i = 0; i <= steps; i++) {
      const volume = 1.0 - i / steps; // 音量を徐々に下げる
      await sound.setVolumeAsync(Math.max(0, volume)); // 音量が0未満にならないように制限
      await new Promise((resolve) => setTimeout(resolve, stepDuration)); // ステップ間で待機
    }
    await sound.stopAsync();
    await sound.unloadAsync();
  } catch (error) {
    console.error("Fade out error:", error);
  }
};

function convertRelativeToNote(
  relativePos: number,
  sortedMelodyNotes: { [i: number]: SortedMelodyNote }
): string | null {
  const noteData = sortedMelodyNotes[relativePos];
  return noteData ? noteData.name : null;
}

export function getOctaveAdjustedNote(
  noteName: string,
  relativePos: number,
  isBass: boolean,
  sortedMelody: { [i: number]: SortedMelodyNote }
): string {
  let baseOctave = isBass ? 2 : 0;
  const octave = sortedMelody[relativePos].octave - baseOctave;
  return `${octave}${noteName}`;
}

export function getDramInstrumentName(instrumentIndex: number): string {
  return dramInstruments[instrumentIndex] || "snare";
}

async function preloadMelodyAndBass(data: MusicData) {
  const { melody, bass, sortedMelodyNotes } = data;

  const melodySoundObjects: Record<string, Audio.Sound> = {};
  const bassSoundObjects: Record<string, Audio.Sound> = {};

  // メロディーをロード
  if (Object.keys(melody).length > 0) {
    const melodyData = melody as {
      [measure: number]: { [beat: number]: NoteData };
    };
    for (const [measureStr, beatsObj] of Object.entries(melodyData)) {
      const measure = parseInt(measureStr, 10);
      for (const [beatStr, noteObj] of Object.entries(beatsObj)) {
        const beat = parseInt(beatStr, 10);
        if (noteObj && noteObj.relativePos !== null) {
          const baseName = convertRelativeToNote(
            noteObj.relativePos,
            sortedMelodyNotes
          );
          if (baseName) {
            const fullName = getOctaveAdjustedNote(
              baseName,
              noteObj.relativePos,
              false,
              sortedMelodyNotes
            );
            if (!melodySoundObjects[fullName]) {
              const soundFile = melodySoundsMap[fullName];
              if (soundFile) {
                const { sound } = await Audio.Sound.createAsync(soundFile);
                melodySoundObjects[fullName] = sound;
              }
            }
          }
        }
      }
    }
  }

  // ベースをロード
  if (Object.keys(bass).length > 0) {
    const bassData = bass as {
      [measure: number]: { [beat: number]: NoteData };
    };
    for (const [measureStr, beatsObj] of Object.entries(bassData)) {
      const measure = parseInt(measureStr, 10);
      for (const [beatStr, noteObj] of Object.entries(beatsObj)) {
        const beat = parseInt(beatStr, 10);
        if (noteObj && noteObj.relativePos !== null) {
          const baseName = convertRelativeToNote(
            noteObj.relativePos,
            sortedMelodyNotes
          );
          if (baseName) {
            const fullName = getOctaveAdjustedNote(
              baseName,
              noteObj.relativePos,
              true,
              sortedMelodyNotes
            );
            if (!bassSoundObjects[fullName]) {
              const soundFile = bassSoundsMap[fullName];
              if (soundFile) {
                const { sound } = await Audio.Sound.createAsync(soundFile);
                bassSoundObjects[fullName] = sound;
              }
            }
          }
        }
      }
    }
  }

  // ドラムはここではロードしない（プールで管理）

  return { melodySoundObjects, bassSoundObjects };
}

let drumPools: DrumPools = {};

async function preloadDrumPools(poolSize: number = 3) {
  drumPools = await createDrumPools(poolSize);
}

export async function playMusic(
  data: MusicData,
  shouldContinue: () => boolean,
  options: {
    playMelody: boolean;
    playBass: boolean;
    playDram: boolean;
  }
) {
  const { bpm, melody, bass, dram, sortedMelodyNotes } = data;

  // BPM → 再生速度計算
  const baseBpm = 120; // デフォルトBPM
  const playbackRate = bpm / baseBpm;

  // メロディ & ベース音源をプリロード
  const { melodySoundObjects, bassSoundObjects } = await preloadMelodyAndBass(
    data
  );

  // ドラムプールを初期化
  await preloadDrumPools(3);

  // 再生ループの初期化
  const melodyBeatsPerMeasure = 4; // 4拍子
  const stepsPerBeat = 4; // 16分音符
  const stepsPerMeasure = melodyBeatsPerMeasure * stepsPerBeat;
  const stepDuration = ((60 / bpm) * 1000) / stepsPerBeat; // ステップごとの間隔（ms）

  let currentMeasure = 0;
  let currentStepInMeasure = 0;

  const cleanup = () => {
    // 音源リソースの解放
    Object.values(melodySoundObjects).forEach((sound) => sound.unloadAsync());
    Object.values(bassSoundObjects).forEach((sound) => sound.unloadAsync());
    Object.values(drumPools).forEach((pool) => pool.unload());
  };

  const scheduleStep = () => {
    if (!shouldContinue()) {
      cleanup();
      return;
    }

    const measure = currentMeasure;
    const stepInMeasure = currentStepInMeasure;

    // ドラム再生
    if (options.playDram && isDramType(dram) && dram[measure]) {
      const drumStep = dram[measure];
      for (const instrument in drumStep) {
        if (drumStep[instrument]?.[stepInMeasure]) {
          const instrumentName = getDramInstrumentName(
            parseInt(instrument, 10)
          );
          const pool = drumPools[instrumentName];
          pool?.play();
        }
      }
    }

    // メロディ再生
    if (
      options.playMelody &&
      melody &&
      (melody as { [measure: number]: { [beat: number]: NoteData } })[measure]
    ) {
      const melodyData = melody as {
        [measure: number]: { [beat: number]: NoteData };
      };
      const beatIndex = Math.floor(stepInMeasure / stepsPerBeat);
      const melodyNote = melodyData[measure]?.[beatIndex];
      if (melodyNote && melodyNote.relativePos !== null) {
        const baseName = convertRelativeToNote(
          melodyNote.relativePos,
          sortedMelodyNotes
        );
        if (baseName) {
          const fullName = getOctaveAdjustedNote(
            baseName,
            melodyNote.relativePos,
            false,
            sortedMelodyNotes
          );
          const sound = melodySoundObjects[fullName];
          if (sound) {
            // 再生速度と音程補正の指定
            sound.setRateAsync(playbackRate, true); // shouldCorrectPitch = true
            sound.playFromPositionAsync(0);
          }
        }
      }
    }

    // ベース再生
    if (
      options.playBass &&
      bass &&
      (bass as { [measure: number]: { [beat: number]: NoteData } })[measure]
    ) {
      const bassData = bass as {
        [measure: number]: { [beat: number]: NoteData };
      };
      const beatIndex = Math.floor(stepInMeasure / stepsPerBeat);
      const bassNote = bassData[measure]?.[beatIndex];
      if (bassNote && bassNote.relativePos !== null) {
        const baseName = convertRelativeToNote(
          bassNote.relativePos,
          sortedMelodyNotes
        );
        if (baseName) {
          const fullName = getOctaveAdjustedNote(
            baseName,
            bassNote.relativePos,
            true,
            sortedMelodyNotes
          );
          const sound = bassSoundObjects[fullName];
          if (sound) {
            // 再生速度と音程補正の指定
            sound.setRateAsync(playbackRate, true); // shouldCorrectPitch = true
            sound.playFromPositionAsync(0);
          }
        }
      }
    }

    // 次ステップへ
    currentStepInMeasure++;
    if (currentStepInMeasure >= stepsPerMeasure) {
      currentStepInMeasure = 0;
      currentMeasure++;
      if (currentMeasure >= Object.keys(melody).length) {
        currentMeasure = 0; // 再ループ
      }
    }

    setTimeout(scheduleStep, stepDuration);
  };

  scheduleStep();
}

function isDramType(
  dram:
    | {}
    | {
        [measure: number]: {
          [instrument: number]: { [step: number]: boolean };
        };
      }
): dram is {
  [measure: number]: { [instrument: number]: { [step: number]: boolean } };
} {
  return (
    typeof dram === "object" &&
    dram !== null &&
    Object.keys(dram).every((key) => !isNaN(Number(key)))
  );
}
