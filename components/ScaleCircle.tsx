import { useContext, useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { ChordContext } from "@/MusicContext";

export const ScaleCircle = () => {
  const { scaleType, root } = useContext(ChordContext);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 回転角度を設定する
    const toValue = scaleType === "メジャー" ? 0 : 90;

    // アニメーションの設定
    Animated.timing(rotation, {
      toValue,
      duration: 300, // アニメーションの長さ（ミリ秒）
      useNativeDriver: true, // パフォーマンス向上のためにネイティブドライバを使用
    }).start();
  }, [scaleType, root]);

  // 回転角度の変換
  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 90],
    outputRange: ["0deg", "90deg"],
  });
  return (
    <>
      {root && (
        <Animated.Image
          source={require("@/assets/images/scale.png")}
          style={[
            styles.scaleCircle,
            {
              transform: [{ rotate: rotationInterpolate }],
            },
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scaleCircle: {
    position: "absolute",
    width: 322,
    height: 322,
  },
});
