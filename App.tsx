import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { AppProvider } from "./src/context/AppContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { theme } from "./src/constants/theme";
import "./src/i18n";

// Import Reactotron configuration in development
if (__DEV__) {
  import("./src/config/ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
