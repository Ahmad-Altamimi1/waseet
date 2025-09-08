import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { AppProvider } from "./src/context/AppContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { theme } from "./src/constants/theme";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider
          theme={{
            colors: {
              primary: theme.colors.accent.lavender,
              accent: theme.colors.accent.gold,
            },
          }}
        >
          <AppProvider>
            <StatusBar
              style="dark"
              backgroundColor={theme.colors.primary.white}
            />
            <AppNavigator />
          </AppProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
