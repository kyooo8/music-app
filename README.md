# CircleTone

音楽理論の 5 度表を用いた作曲アプリです。

## 参考動画

https://www.youtube.com/watch?v=HX0cYrNknN4&list=LL&index=36

## URL

なし

## 使用技術

- TypeScript
- Node.js
- React Native
- Expo
- Firebase
  - Authentication
  - Firestore Database

## 機能一覧

- ユーザー登録、ログイン、ログアウト
- プロジェクト作成、削除機能
- Circle 機能（コード進行）
- Tone 機能（メロディー、ベース、ドラム）

## 各画面

|                                                               |                                                                 |
| ------------------------------------------------------------- | --------------------------------------------------------------- |
| トップ画面                                                    | circle 画面                                                     |
| <img src="/assets/images/top.jpg" alt="top" width="300"/>     | <img src="/assets/images/circle.jpg" alt="circle" width="300"/> |
| コード進行選択（ダブルクリックでルート音、長押しでコード）    | コードの形変化（コード長押しでモーダル表示）                    |
| <img src="/assets/images/chord.jpg" alt="chord" width="300"/> | <img src="/assets/images/shape.jpg" alt="shape" width="300"/>   |
| Note 画面（ピアノ入力）                                       | ベース入力                                                      |
| <img src="/assets/images/piano.jpg" alt="piano" width="300"/> | <img src="/assets/images/base.jpg" alt="base" width="300"/>     |
| ドラム入力                                                    |                                                                 |
| <img src="/assets/images/dram.jpg" alt="dram" width="300"/>   |                                                                 |

## 今後の展望

- 各ストアに一般公開をして色々な人に利用してもらいたいが、ReactNative だけだと音の再生が上手くいかず、特に音を重ねて鳴らす際にずれたりラグがありまだ実用的なレベルではない。改善するにはそれどぞれ（ios,android）のネイティブ部分のコードを書く必要があり、まだ実現できていない。

- 参考動画でもあるように各コードの役割やおすすめのコード進行を表示する機能の追加。

- 短いプロジェクトをつなげて 1 曲作れるようなブロック作曲機能の追加
