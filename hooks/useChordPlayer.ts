// PlayMusic.tsx

import React from "react";
import { Alert, TouchableOpacity, Text, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";

type NoteDuration = "whole" | "half" | "quarter" | "eighth" | "sixteenth";

interface ChordProgressionItem {
  relativeIndex: number;
  shape: string; // "maj7", "min", など
}

interface MelodyNote {
  relativePos: number; // relative to sortedMelodyNotes
  duration: NoteDuration;
}

interface BassNote {
  relativePos: number; // relative to sortedMelodyNotes
  duration: NoteDuration;
}

interface DramMeasure {
  [instrument: number]: {
    [step: number]: boolean; // trueなら鳴る
  };
}

interface SortedMelodyNote {
  name: string; // "3C", "2F"など
  index: number;
}

interface MusicData {
  root: string;
  bpm: number;
  scaleType: string;
  scaleNotes: { [index: number]: string };
  chordProgression: { [index: number]: ChordProgressionItem };
  sortedMelodyNotes: { [index: number]: SortedMelodyNote };
  melody: { [measure: number]: { [beat: number]: MelodyNote | null } };
  bass: { [measure: number]: { [beat: number]: BassNote | null } };
  dram: { [measure: number]: DramMeasure };
  updatedAt: any; // Timestamp
}

// 楽器名マッピング (dram用)
const dramInstruments = [
  "F-hihat", // 0例: "Fハイハット" -> ファイル名 "F-hihat.wav"などに合わせる
  "tamtam", // 1 タムタム
  "floor-tom", // 2 フロアタム
  "crash", // 3 クラッシュ
  "ride", // 4 ライド
  "o-hihat", // 5 Oハイハット
  "c-hihat", // 6 Cハイハット
  "snare", // 7 スネア
  "bass-drum", // 8 バス
  "pedal-hihat", // 9 ペダルハイハット
];

const durationMap: Record<NoteDuration, number> = {
  whole: 4,
  half: 2,
  quarter: 1,
  eighth: 0.5,
  sixteenth: 0.25,
};

const loadSound = async (path: string) => {
  const { sound } = await Audio.Sound.createAsync(
    require(`./assets/sounds/${path}`)
  );
  return sound;
};

const convertRelativeToNote = (
  relativePos: number,
  sortedMelodyNotes: { [i: number]: SortedMelodyNote }
): string | null => {
  const noteData = sortedMelodyNotes[relativePos];
  return noteData ? noteData.name : null;
};

const getDramInstrumentName = (instrumentIndex: number): string => {
  return dramInstruments[instrumentIndex] || "snare";
};

const fetchMusicData = async (
  userId: string,
  musicId: string
): Promise<MusicData | null> => {
  if (!auth.currentUser) {
    Alert.alert("エラー", "ユーザーがログインしていません。");
    console.log("ユーザーがログインしていません。");
    return null;
  }

  const docRef = doc(db, `users/${userId}/musics/${musicId}`);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as MusicData;
      console.log("Fetched data:", data);
      return data;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log("Fetch error:", error);
    Alert.alert("取得エラー", "データの取得に失敗しました。");
    return null;
  }
};

const playMusic = async (data: MusicData) => {
  const { bpm, melody, bass, dram, sortedMelodyNotes } = data;

  const melodySounds: Record<string, Audio.Sound> = {};
  const bassSounds: Record<string, Audio.Sound> = {};
  const dramSounds: Record<string, Audio.Sound> = {};

  // プリロード
  try {
    // MelodyとBassで使用される全音声ファイルを取得
    for (let measure in melody) {
      for (let beat in melody[measure]) {
        const noteObj = melody[measure][beat];
        if (noteObj && noteObj.relativePos !== null) {
          const noteName = convertRelativeToNote(
            noteObj.relativePos,
            sortedMelodyNotes
          );
          if (noteName && !melodySounds[noteName]) {
            melodySounds[noteName] = await loadSound(`melody/${noteName}.wav`);
          }
        }
      }
    }

    for (let measure in bass) {
      for (let beat in bass[measure]) {
        const noteObj = bass[measure][beat];
        if (noteObj && noteObj.relativePos !== null) {
          const noteName = convertRelativeToNote(
            noteObj.relativePos,
            sortedMelodyNotes
          );
          if (noteName && !bassSounds[noteName]) {
            bassSounds[noteName] = await loadSound(`bass/${noteName}.wav`);
          }
        }
      }
    }

    // Dram楽器のプリロード
    for (let measure in dram) {
      for (let instrument in dram[measure]) {
        for (let step in dram[measure][instrument]) {
          const isActive = dram[measure][instrument][step];
          if (isActive) {
            const instrumentName = getDramInstrumentName(Number(instrument));
            if (!dramSounds[instrumentName]) {
              dramSounds[instrumentName] = await loadSound(
                `dram/${instrumentName}.wav`
              );
            }
          }
        }
      }
    }

    // BPMから一拍(quarter)の長さ(ms)
    const beatDuration = (60 / bpm) * 1000; // quarter note = 1拍
    // 1小節=4拍と仮定(質問文参照)

    const totalMeasures = 8; // 最大8小節
    const melodyBeatsPerMeasure = 4; // melody, bassともに1小節4音
    const dramStepsPerMeasure = 16; // drumは1小節16ステップ
    // 再生ロジック:
    // 音価durationにより待機時間が変わるが、
    // melody,bassはbeat単位(4beat/measure)
    // dramは16ステップもあるため同期が必要

    // ここでの前提:
    // - melody/bassは4beat/measure
    // - dramは16step/measure
    // stepあたり: dramは1/4 beatごとに鳴る?
    // => 1beat = 4dramStep
    // つまり、dramの1ステップは(beatDuration/4)

    const dramStepDuration = beatDuration / 4;

    // measureループ
    for (let measure = 0; measure < totalMeasures; measure++) {
      // メロディとベースは4beat
      for (let beat = 0; beat < melodyBeatsPerMeasure; beat++) {
        // melody再生
        const melodyNote = melody[measure]?.[beat];
        if (melodyNote && melodyNote.relativePos !== null) {
          const noteName = convertRelativeToNote(
            melodyNote.relativePos,
            sortedMelodyNotes
          );
          if (noteName) {
            const sound = melodySounds[noteName];
            if (sound) {
              await sound.replayAsync();
            }
          }
        }

        // bass再生
        const bassNote = bass[measure]?.[beat];
        if (bassNote && bassNote.relativePos !== null) {
          const noteName = convertRelativeToNote(
            bassNote.relativePos,
            sortedMelodyNotes
          );
          if (noteName) {
            const sound = bassSounds[noteName];
            if (sound) {
              await sound.replayAsync();
            }
          }
        }

        // DRAM再生
        // 1beatにつきdramは4stepある: 0~3 step
        for (let stepInBeat = 0; stepInBeat < 4; stepInBeat++) {
          const dramStep = beat * 4 + stepInBeat;
          // dram[measure][instrument][dramStep]
          if (dram[measure]) {
            for (let instrument = 0; instrument < 10; instrument++) {
              const isActive = dram[measure][instrument]?.[dramStep];
              if (isActive) {
                const instrumentName = getDramInstrumentName(instrument);
                const sound = dramSounds[instrumentName];
                if (sound) {
                  await sound.replayAsync();
                }
              }
            }
          }
          // dramの1stepごとに待機
          await new Promise((resolve) => setTimeout(resolve, dramStepDuration));
        }

        // melodyNoteのdurationに応じた待機
        // 注意: ここではdramを1stepごとに再生しているため、
        // dramとmelody/bassの同期をどう扱うかは設計次第。
        // とりあえずメロディは4分音符=1拍を基準に考える。
        // dramをstepごとに再生しているため、すでに細かく待機済み。
        // ここでは追加待機せず、すぐ次のbeatへ
      }
    }

    // 再生終了後アンロード
    Object.values(melodySounds).forEach((sound) => sound.unloadAsync());
    Object.values(bassSounds).forEach((sound) => sound.unloadAsync());
    Object.values(dramSounds).forEach((sound) => sound.unloadAsync());
  } catch (error) {
    console.log("Playback error:", error);
  }
};

export default function PlayMusicButton({ musicId }: { musicId: string }) {
  const router = useRouter();

  const handlePlay = async () => {
    if (!auth.currentUser) {
      Alert.alert("エラー", "ログインが必要です。");
      return;
    }
    const userId = auth.currentUser.uid;
    const data = await fetchMusicData(userId, musicId);
    if (data) {
      await playMusic(data);
    }
  };

  return (
    <TouchableOpacity onPress={handlePlay} style={styles.button}>
      <Text style={styles.text}>再生</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 12,
    lineHeight: 24,
    color: "#fff",
  },
});
