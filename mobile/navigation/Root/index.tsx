import * as TaskManager from "expo-task-manager";
import React, { useEffect } from "react";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { AddTabNavigator } from "./add";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { GeofencingEventType } from "expo-location";
import { HomeScreen } from "./Home";
import { Ionicons } from "@expo/vector-icons";
import { Leaderboard } from "./Leaderboard";
import { Lookback } from "./Lookback";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { QuestionModal } from "./QuestionModal";
import { Region } from "../../types";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type RootStackParamList = {
  home: undefined;
  question: { questionId: string };
  lookback: undefined;
  add: undefined;
  leaderboard: undefined;
};

export type RootScreenProps<T> = NativeStackScreenProps<
  RootStackParamList,
  T extends keyof RootStackParamList
    ? T
    : "home" | "question" | "lookback" | "add" | "leaderboard"
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const pointColor = () => {
    if (!user?.points || user.points < 0) return theme.colors.error;
    if (user?.points! < 30) return theme.colors.secondary;
    return theme.colors.tertiary;
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: "Home",
          headerLeft: () => (
            <View
              style={{
                padding: 4,
                // borderColor: "gray",
                // borderWidth: 2,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  color: pointColor(),
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >{`${user?.points || 0} points`}</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="lookback"
        component={Lookback}
        options={{ headerShown: true, headerTitle: "Lookback" }}
      />
      <Stack.Screen
        name="question"
        component={QuestionModal}
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Screen
        name="add"
        component={AddTabNavigator}
        options={{ headerShown: false, headerTitle: "Add" }}
      />
      <Stack.Screen
        name="leaderboard"
        component={Leaderboard}
        options={{ headerShown: true, headerTitle: "Leaderboard" }}
      />
    </Stack.Navigator>
  );
};
