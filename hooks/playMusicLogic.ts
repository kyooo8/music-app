// playMusicLogic.ts
import { Audio } from "expo-av";
import {
  melodySoundsMap,
  bassSoundsMap,
  dramSoundsMap,
} from "@/constants/soundMaps";
import { NoteData, SortedMelodyNote } from "@/types/music";

// 定数が存在しない場合の回避策
const INTERRUPTION_MODE_IOS_DO_NOT_MIX = 1;
const INTERRUPTION_MODE_ANDROID_DO_NOT_MIX = 1;

// オーディオモードの設定（回避策）
const setAudioModeWithFallback = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX, // 1
      interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX, // 1
      playThroughEarpieceAndroid: false,
    });
  } catch (error) {
    console.log("Error setting audio mode with fallback:", error);
  }
};

// サウンドマップからサウンドファイルを取得するヘルパー関数
const getSoundFileByKey = (key: string) => {
  if (melodySoundsMap[key]) return melodySoundsMap[key];
  if (bassSoundsMap[key]) return bassSoundsMap[key];
  if (dramSoundsMap[key]) return dramSoundsMap[key];
  console.warn(`Sound file not found for key: ${key}`);
  return null;
};

// サウンドプールを管理するクラス
class SoundPool {
  private pool: Record<string, Audio.Sound[]> = {};
  private maxInstances: number;

  constructor(maxInstancesPerSound: number = 4) {
    this.maxInstances = maxInstancesPerSound;
  }

  // サウンドをプールに追加
  addSound = async (key: string, soundFile: any) => {
    if (!soundFile) {
      console.warn(
        `Cannot add sound for key: ${key} because soundFile is null.`
      );
      return;
    }

    if (!this.pool[key]) {
      this.pool[key] = [];
    }
    if (this.pool[key].length < this.maxInstances) {
      try {
        const { sound } = await Audio.Sound.createAsync(soundFile, {
          shouldPlay: false,
        });
        this.pool[key].push(sound);
      } catch (error) {
        console.error(`Error loading sound for key ${key}:`, error);
      }
    }
  };

  // サウンドを再生
  playSound = async (key: string, isBass: boolean) => {
    const sounds = this.pool[key];
    if (sounds && sounds.length > 0) {
      // 最初に使用可能なサウンドを見つけて再生
      for (const sound of sounds) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && !status.isPlaying) {
            await sound.replayAsync();
            return;
          }
        } catch (error) {
          console.error(`Error checking status for sound ${key}:`, error);
        }
      }
      // すべてのサウンドが再生中の場合、新しいインスタンスを作成
      const soundFile = getSoundFileByKey(key);
      if (soundFile) {
        try {
          const { sound } = await Audio.Sound.createAsync(soundFile, {
            shouldPlay: true,
          });
          this.pool[key].push(sound);
        } catch (error) {
          console.error(`Error creating new sound instance for ${key}:`, error);
        }
      }
    } else {
      console.warn(`No sounds available in pool for key: ${key}`);
    }
  };

  // サウンドをアンロード
  unloadAll = async () => {
    const unloadPromises: Promise<any>[] = [];
    for (const key in this.pool) {
      for (const sound of this.pool[key]) {
        unloadPromises.push(sound.unloadAsync());
      }
    }
    await Promise.all(unloadPromises);
    this.pool = {};
  };
}

const dramInstruments = [
  "hand-clap",
  "tamtam",
  "floor-tom",
  "crash",
  "ride",
  "open-hihat",
  "closed-hihat",
  "snare",
  "bass-drum",
  "pedal-hihat",
];

interface ChordProgressionItem {
  chord: number;
  shape: string;
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

const convertRelativeToNote = (
  relativePos: number,
  sortedMelodyNotes: { [i: number]: SortedMelodyNote }
): string | null => {
  const noteData = sortedMelodyNotes[relativePos];
  return noteData ? noteData.name : null; // "A#", "C"などオクターブなし
};

// プレイバック関数
export async function playMusic(
  data: MusicData,
  shouldContinue: () => boolean
) {
  const { bpm, melody, bass, dram, sortedMelodyNotes } = data;

  // オーディオモードを設定
  await setAudioModeWithFallback();

  // サウンドプールの初期化
  const soundPool = new SoundPool(4); // 各サウンドにつき最大4インスタンス

  // 全てのサウンドをプリロード
  const preloadPromises: Promise<void>[] = [];

  // メロディのサウンドプリロード
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
          const fullName = `${
            sortedMelodyNotes[noteObj.relativePos].octave
          }${baseNoteName}`;
          preloadPromises.push(
            soundPool.addSound(fullName, melodySoundsMap[fullName])
          );
        }
      }
    }
  }

  // ベースのサウンドプリロード
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
          const melodyNote = sortedMelodyNotes[noteObj.relativePos];
          if (!melodyNote) {
            console.warn(
              `No melody note found for relativePos: ${noteObj.relativePos}`
            );
            continue;
          }
          const bassOctave = melodyNote.octave - 2;
          const fullName = `${bassOctave}${baseNoteName}`;
          preloadPromises.push(
            soundPool.addSound(fullName, bassSoundsMap[fullName])
          );
        }
      }
    }
  }

  // ドラムのサウンドプリロード
  for (let measureStr in dram) {
    const measure = Number(measureStr);
    for (let instrumentStr in dram[measure]) {
      const instrument = Number(instrumentStr);
      for (let stepStr in dram[measure][instrument]) {
        const step = Number(stepStr);
        const isActive = dram[measure][instrument][step];
        if (isActive) {
          const instrumentName = dramInstruments[instrument] || "snare";
          preloadPromises.push(
            soundPool.addSound(instrumentName, dramSoundsMap[instrumentName])
          );
        }
      }
    }
  }

  // 全てのサウンドをプリロード
  try {
    await Promise.all(preloadPromises);
    console.log("All sounds preloaded successfully.");
  } catch (error) {
    console.log("Error preloading sounds:", error);
    return;
  }

  const beatDuration = (60 / bpm) * 1000; // quarter note in ms
  const dramStepDuration = beatDuration / 4;
  const measureCount = Object.keys(dram).length;
  const melodyBeatsPerMeasure = 4;

  // 再生ループ
  try {
    while (shouldContinue()) {
      for (let measure = 0; measure < measureCount; measure++) {
        if (!shouldContinue()) break;
        for (let beat = 0; beat < melodyBeatsPerMeasure; beat++) {
          if (!shouldContinue()) break;

          const startTime = Date.now();

          // メロディの再生
          const melodyNote = melody[measure]?.[beat];
          if (melodyNote && melodyNote.relativePos !== null) {
            const baseNoteName = convertRelativeToNote(
              melodyNote.relativePos,
              sortedMelodyNotes
            );
            if (baseNoteName && shouldContinue()) {
              const melodyNoteData = sortedMelodyNotes[melodyNote.relativePos];
              if (!melodyNoteData) {
                console.warn(
                  `No melody note data found for relativePos: ${melodyNote.relativePos}`
                );
                continue;
              }
              const fullName = `${melodyNoteData.octave}${baseNoteName}`;
              console.log(`Playing melody sound: ${fullName}`);
              await soundPool.playSound(fullName, false);
            }
          }

          // ベースの再生
          const bassNote = bass[measure]?.[beat];
          if (bassNote && bassNote.relativePos !== null) {
            const baseNoteName = convertRelativeToNote(
              bassNote.relativePos,
              sortedMelodyNotes
            );
            if (baseNoteName && shouldContinue()) {
              const bassNoteData = sortedMelodyNotes[bassNote.relativePos];
              if (!bassNoteData) {
                console.warn(
                  `No melody note data found for bass relativePos: ${bassNote.relativePos}`
                );
                continue;
              }
              const bassOctave = bassNoteData.octave - 2;
              const fullName = `${bassOctave}${baseNoteName}`;
              console.log(`Playing bass sound: ${fullName}`);
              await soundPool.playSound(fullName, true);
            }
          }

          // ドラムの再生
          for (let stepInBeat = 0; stepInBeat < 4; stepInBeat++) {
            if (!shouldContinue()) break;
            const dramStep = beat * 4 + stepInBeat;
            if (dram[measure]) {
              for (
                let instrument = 0;
                instrument < dramInstruments.length;
                instrument++
              ) {
                const isActive = dram[measure][instrument]?.[dramStep];
                if (isActive && shouldContinue()) {
                  const instrumentName = dramInstruments[instrument] || "snare";
                  console.log(`Playing drum sound: ${instrumentName}`);
                  await soundPool.playSound(instrumentName, false);
                }
              }
            }
            // タイミング調整
            const elapsed = Date.now() - startTime;
            const delay = dramStepDuration - elapsed;
            if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("Playback error:", error);
  } finally {
    // リソースの解放
    try {
      await soundPool.unloadAll();
      console.log("All sounds unloaded successfully.");
    } catch (error) {
      console.log("Error unloading sounds:", error);
    }
  }
}
