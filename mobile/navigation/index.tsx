import React from "react";
import { AuthNavigator } from "./Auth";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./Root";
import { useAuth } from "../hooks/useAuth";

export const Navigation = () => {
  const auth = useAuth();
  return auth?.user ? <RootNavigator /> : <AuthNavigator />;
};
