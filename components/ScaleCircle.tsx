import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface Props {
  scaleType: "メジャー" | "マイナー";
}

export function ScaleCircle({ scaleType }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;
  const theme = useColorScheme() ?? "light";

  useEffect(() => {
    // 回転角度を設定する
    const toValue = scaleType === "メジャー" ? 0 : 90;

    // アニメーションの設定
    Animated.timing(rotation, {
      toValue,
      duration: 300, // アニメーションの長さ（ミリ秒）
      useNativeDriver: true, // パフォーマンス向上のためにネイティブドライバを使用
    }).start();
  }, [scaleType]);

  // 回転角度の変換
  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 90],
    outputRange: ["0deg", "90deg"],
  });
  return (
    <Animated.Image
      source={require("@/assets/images/scale.png")}
      style={[
        styles.scaleCircle,
        {
          transform: [{ rotate: rotationInterpolate }],
        },
      ]}
    />
  );

  // return theme === "light" ? (
  //   <Animated.Image
  //     source={require("@/assets/images/scale-light.png")}
  //     style={[
  //       styles.scaleCircle,
  //       {
  //         transform: [{ rotate: rotationInterpolate }],
  //       },
  //     ]}
  //   />
  // ) : (
  //   <Animated.Image
  //     source={require("@/assets/images/scale-dark.png")}
  //     style={[
  //       styles.scaleCircle,
  //       {
  //         transform: [{ rotate: rotationInterpolate }],
  //       },
  //     ]}
  //   />
  // );
}

const styles = StyleSheet.create({
  scaleCircle: {
    position: "absolute",
    width: 322,
    height: 322,
  },
});
