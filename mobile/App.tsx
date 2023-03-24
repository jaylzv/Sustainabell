import * as TaskManager from "expo-task-manager";
import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import { Navigation } from "./navigation";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, useColorScheme, View } from "react-native";
import { ThemeProp } from "react-native-paper/lib/typescript/src/types";
import {
  Provider as PaperProvider,
  MD3DarkTheme as DefaultDarkTheme,
  MD3LightTheme as DefaultLightTheme,
} from "react-native-paper";
import {
  DarkTheme as DarkNativeTheme,
  DefaultTheme as DefaultNativeTheme,
  ThemeProvider,
} from "@react-navigation/native";

const queryClient = new QueryClient();

export default function App() {
  const colorScheme = useColorScheme();

  const DarkTheme: ThemeProp = {
    ...DefaultDarkTheme,
    roundness: 8,
    colors: {
      ...DefaultDarkTheme.colors,
      primary: "#FFDBCC",
      secondary: "#55CBCD",
      tertiary: "#54ce1b",
      error: "#ea6279bd",
    },
    mode: "adaptive",
  };

  const LightTheme: ThemeProp = {
    ...DefaultLightTheme,
    roundness: 8,
    colors: {
      ...DefaultLightTheme.colors,
      primary: "#f57740",
      secondary: "#229193",
      error: "#f13a59",
      tertiary: "#54ce1b",
    },
    mode: "adaptive",
  };

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkNativeTheme : DefaultNativeTheme}
        >
          <PaperProvider
            theme={colorScheme === "dark" ? DarkTheme : LightTheme}
          >
            <RecoilRoot>
              <AuthProvider>
                <Navigation />
                <StatusBar style="auto" />
              </AuthProvider>
            </RecoilRoot>
          </PaperProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
