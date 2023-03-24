import React from "react";
import { EntryScreen } from "./Entry";
import { SignInScreen } from "./SignIn";
import { SignUpScreen } from "./SignUp";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

export type AuthStackParamList = {
  entry: undefined;
  signin: undefined;
  signup: undefined;
};

export type AuthScreenProps<T> = NativeStackScreenProps<
  AuthStackParamList,
  T extends keyof AuthStackParamList ? T : "signin" | "signup" | "entry"
>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="entry"
        component={EntryScreen}
        options={{ headerShown: false, headerTitle: "Sign In" }}
      />
      <Stack.Screen
        name="signin"
        component={SignInScreen}
        options={{ headerShown: false, headerTitle: "Sign In" }}
      />
      <Stack.Screen
        name="signup"
        component={SignUpScreen}
        options={{ headerShown: false, headerTitle: "Create an Account" }}
      />
    </Stack.Navigator>
  );
};
