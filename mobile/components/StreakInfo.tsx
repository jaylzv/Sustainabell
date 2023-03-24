import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Easing } from "react-native-reanimated";
import { Text } from "react-native-paper";
import { useAuth } from "../hooks/useAuth";

export const StreakInfo = () => {
  const { user } = useAuth();
  const ORIGINAL_COLOR = "#f57740";
  const SUCCESS_COLOR = "#54ce1b";
  const color = new Animated.Value(0);
  let borderColor = color.interpolate({
    inputRange: [0, 1],
    outputRange: [ORIGINAL_COLOR, SUCCESS_COLOR],
  });

  useEffect(() => {
    Animated.timing(color, {
      toValue: 1,
      duration: 4000,
      easing: Easing.bounce,
      useNativeDriver: false,
    }).start();
  }, [user?.streak]);

  return user?.streak && user.streak > 1 ? (
    <Animated.View style={[styles.container, { borderColor: borderColor }]}>
      <Text style={styles.text}>🎉🎉🎉</Text>
      <Text style={[styles.text, { fontSize: 20 }]}>
        You're on a {user.streak} day sustainability streak!
      </Text>
    </Animated.View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "gray",
    padding: 16,
    margin: 4,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
