// drumPool.ts
import { Audio } from "expo-av";
import { dramSoundsMap } from "@/constants/soundMaps";

// ドラムインストゥルメント一覧を外部に切り出す（循環参照防止のため）
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

/**
 * ドラム音ごとに「同じ音源を複数個」用意するためのサウンドプール。
 * 連続で同じドラム音を鳴らしても音が抜けづらくなる。
 */
export interface DrumPools {
  [instrumentName: string]: {
    // 同じドラム音を複数保持
    sounds: Audio.Sound[];
    // 再生状態管理
    isPlaying: boolean[];
    // 再生メソッド
    play: () => Promise<Audio.Sound>;
    // アンロード
    unload: () => Promise<void>;
  };
}

/**
 * 指定したドラム音について、poolSizeだけ複数インスタンスを作成する
 */
async function createDrumPool(
  instrumentName: string,
  poolSize: number
): Promise<{
  sounds: Audio.Sound[];
  isPlaying: boolean[];
  play: () => Promise<Audio.Sound>;
  unload: () => Promise<void>;
} | null> {
  const soundFile = dramSoundsMap[instrumentName];
  if (!soundFile) return null;

  const sounds: Audio.Sound[] = [];
  const isPlaying: boolean[] = [];

  // 同じ音源を poolSize 個ロード
  for (let i = 0; i < poolSize; i++) {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    sounds.push(sound);
    isPlaying.push(false);
  }

  // 再生
  const play = async (): Promise<Audio.Sound> => {
    // 空いてるインスタンスを探す
    let index = isPlaying.findIndex((playing) => !playing);
    // 全部再生中なら先頭を強制再利用する
    if (index === -1) {
      index = 0;
      await sounds[index].stopAsync();
    }

    // 音を再生
    isPlaying[index] = true;
    await sounds[index].setPositionAsync(0);
    await sounds[index].playAsync();

    // 再生完了を検知して isPlaying を false に戻す
    sounds[index].setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        isPlaying[index] = false;
        // 再生完了後は監視を解除
        sounds[index].setOnPlaybackStatusUpdate(null);
      }
    });

    // 再生した sound を返す
    return sounds[index];
  };

  /**
   * プールを解放する関数
   */
  const unload = async () => {
    for (const sound of sounds) {
      await sound.unloadAsync();
    }
  };

  return { sounds, isPlaying, play, unload };
}

/**
 * ドラム音全てについて poolSize 個ずつ作り、連続再生をサポートする
 */
export async function createDrumPools(poolSize = 3): Promise<DrumPools> {
  const drumPools: DrumPools = {};

  for (const instrumentName of dramInstruments) {
    const pool = await createDrumPool(instrumentName, poolSize);
    if (pool) {
      drumPools[instrumentName] = pool;
    }
  }

  return drumPools;
}
