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

  // メロディ & ベースをロード
  const { melodySoundObjects, bassSoundObjects } = await preloadMelodyAndBass(
    data
  );

  // ドラムは複数インスタンスプール
  await preloadDrumPools(3);

  // データが空かどうか
  const haveMelody = !!Object.keys(melody).length;
  const haveBass = !!Object.keys(bass).length;
  const haveDram = !!Object.keys(dram).length;

  // データを型アサーション
  const melodyData = haveMelody
    ? (melody as { [measure: number]: { [beat: number]: NoteData } })
    : {};
  const bassData = haveBass
    ? (bass as { [measure: number]: { [beat: number]: NoteData } })
    : {};
  const dramData = haveDram
    ? (dram as {
        [measure: number]: {
          [instrument: number]: { [step: number]: boolean };
        };
      })
    : {};

  // 1小節あたりの拍数、1拍あたりのステップ数
  const melodyBeatsPerMeasure = 4; // 4拍子想定
  const stepsPerBeat = 4; // 1拍を4分割(=16分音符)
  const stepsPerMeasure = melodyBeatsPerMeasure * stepsPerBeat; // 16ステップ/小節

  // 再生する小節数 (melody, bass, dram の最大小節数)
  const melodyMeasures = haveMelody ? Object.keys(melody).length : 0;
  const bassMeasures = haveBass ? Object.keys(bass).length : 0;
  const dramMeasures = haveDram ? Object.keys(dram).length : 0;
  const measureCount =
    Math.max(melodyMeasures, bassMeasures, dramMeasures) || 1;

  // BPM → 1拍=beatDuration ms → 1ステップ=stepDuration ms
  const beatDuration = (60 / (bpm || 120)) * 1000;
  const stepDuration = beatDuration / stepsPerBeat;

  function playLoop() {
    let currentMeasure = 0;
    let currentStepInMeasure = 0; // 0..(stepsPerMeasure-1)

    function scheduleStep() {
      if (!shouldContinue()) {
        cleanup();
        return;
      }

      const measure = currentMeasure;
      const stepInMeasure = currentStepInMeasure;

      // デバッグ用ログ
      console.log(`Measure: ${measure}, Step: ${stepInMeasure}`);

      // ドラム再生
      if (options.playDram && haveDram && dramData[measure]) {
        for (let instrument = 0; instrument < 10; instrument++) {
          const isActive = dramData[measure][instrument]?.[stepInMeasure];
          if (isActive) {
            const instrumentName = getDramInstrumentName(instrument);
            const pool = drumPools[instrumentName];

            if (pool) {
              pool
                .play()
                .then((soundInstance) => {
                  // ドラム音が短いため、stopAsync() は不要
                  // もし必要なら以下のコメントを解除
                  /*
                  setTimeout(async () => {
                    try {
                      await soundInstance.stopAsync();
                    } catch (e) {
                      console.log("stop error:", e);
                    }
                  }, stepDuration);
                  */
                })
                .catch((err) => console.log("drum pool play error:", err));
            }
          }
        }
      }

      // メロディ・ベース再生は「拍頭のみ」
      if (stepInMeasure % stepsPerBeat === 0) {
        const beatIndex = stepInMeasure / stepsPerBeat; // 0..3

        // メロディ
        if (options.playMelody && haveMelody && melodyData[measure]) {
          const melodyNote = melodyData[measure][beatIndex];
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
                sound.setPositionAsync(0);
                sound.playAsync(); // 同期再生
              }
            }
          }
        }

        // ベース
        if (options.playBass && haveBass && bassData[measure]) {
          const bassNote = bassData[measure][beatIndex];
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
                sound.setPositionAsync(0);
                sound.playAsync();
              }
            }
          }
        }
      }

      // 次ステップへ
      currentStepInMeasure += 1;
      if (currentStepInMeasure >= stepsPerMeasure) {
        currentStepInMeasure = 0;
        currentMeasure += 1;
        if (currentMeasure >= measureCount) {
          // ループ再生したいなら:
          currentMeasure = 0;
        }
      }

      if (shouldContinue()) {
        setTimeout(scheduleStep, stepDuration);
      } else {
        cleanup();
      }
    }

    scheduleStep();
  }

  function cleanup() {
    // メロディ/ベース音源のアンロード
    Object.values(melodySoundObjects).forEach((sound) => sound.unloadAsync());
    Object.values(bassSoundObjects).forEach((sound) => sound.unloadAsync());

    // ドラムプールのアンロード
    for (const poolName of Object.keys(drumPools)) {
      drumPools[poolName].unload();
    }
  }

  playLoop();
}
