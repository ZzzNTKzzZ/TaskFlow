import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import {
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Inter_400Regular } from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_800ExtraBold,
    Manrope_700Bold,
    Manrope_600SemiBold,
    Inter_400Regular,
  });
  useEffect(() => {
    console.log("Fonts loaded:", loaded); // Kiểm tra log trong Terminal xem có true không
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
      <Stack
        screenOptions={{
          headerShown: false,
          // contentStyle: { backgroundColor: "#fff" },
        }}
      >
        
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="Auth/Register" />
        <Stack.Screen name="Auth/Login" />
        <Stack.Screen name="Workspace/Create" />
      </Stack>
  );
}
