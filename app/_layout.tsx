import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { onAuthChange, createOrGetUserDoc } from "@/lib/firebaseAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const { setUser } = useAuthStore();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Auth state listener - runs after fonts are loaded
  useEffect(() => {
    if (!fontsLoaded) return;

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Determine auth provider from Firebase user
        const providerData = firebaseUser.providerData[0];
        let provider: "apple" | "google" | "email" = "email";
        if (providerData?.providerId === "apple.com") {
          provider = "apple";
        } else if (providerData?.providerId === "google.com") {
          provider = "google";
        }

        const user = await createOrGetUserDoc(firebaseUser, provider);
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [fontsLoaded, setUser]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="story/[id]" options={{ animation: "none" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
