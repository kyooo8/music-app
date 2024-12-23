// soundPool.ts
import { Audio } from "expo-av";

/**
 * プールされたSoundインスタンスの状態を管理するための型
 */
interface SoundInstance {
  sound: Audio.Sound;
  isPlaying: boolean;
}

/**
 * サウンドプールを表す型
 */
export interface SoundPool {
  // プールされた同じ音源インスタンス
  instances: SoundInstance[];
  // 音源を再生する
  play: () => Promise<Audio.Sound>;
  // プールを解放（unload）する
  unload: () => Promise<void>;
}

/**
 * 同じ音源ファイルを poolSize 個だけ準備し、
 * 連続再生を可能にするサウンドプールを作成する。
 *
 * @param soundFile Audio.Sound.createAsync でロードできる音源ファイル (require(...) や { uri: string } 等)
 * @param poolSize プールするインスタンスの数
 * @returns SoundPool
 */
export async function createSoundPool(
  soundFile: any,
  poolSize: number = 3
): Promise<SoundPool> {
  const instances: SoundInstance[] = [];

  // poolSize 個だけ同じ音源をロードし、配列に格納
  for (let i = 0; i < poolSize; i++) {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    instances.push({ sound, isPlaying: false });
  }

  /**
   * 音源を再生する関数
   */
  const play = async (): Promise<Audio.Sound> => {
    // 空いてるインスタンスを探す
    let instance = instances.find((inst) => !inst.isPlaying);

    // 見つからなければ、最初のインスタンスを強制再利用する
    if (!instance) {
      instance = instances[0];
      // 途中再生中の場合は停止
      await instance.sound.stopAsync();
    }

    // 再生前に位置を0に戻し、isPlayingをtrueに
    instance.isPlaying = true;
    await instance.sound.setPositionAsync(0);
    await instance.sound.playAsync();

    // 再生完了を検知してisPlayingをfalseに戻す
    instance.sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        instance.isPlaying = false;
        // 次に再生する時は再度setOnPlaybackStatusUpdateを登録するので、
        // ここでは一旦クリアしておく
        instance.sound.setOnPlaybackStatusUpdate(null);
      }
    });
    await instance.sound.setPositionAsync(0);
    await instance.sound.playAsync();

    instance.sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        instance.isPlaying = false;
        instance.sound.setOnPlaybackStatusUpdate(null);
      }
    });

    // ここで実際のAudio.Soundをreturn
    return instance.sound;
  };

  /**
   * プールを解放する関数
   */
  const unload = async () => {
    for (const inst of instances) {
      await inst.sound.unloadAsync();
    }
  };

  return { instances, play, unload };
}
