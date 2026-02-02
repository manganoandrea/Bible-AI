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

    let isMounted = true;
    let currentUserId: string | null = null;

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      const userId = firebaseUser?.uid ?? null;
      currentUserId = userId;

      if (firebaseUser) {
        try {
          const providerData = firebaseUser.providerData?.[0];
          const provider: "apple" | "google" | "email" =
            providerData?.providerId?.includes("apple")
              ? "apple"
              : providerData?.providerId?.includes("google")
                ? "google"
                : "email";

          const user = await createOrGetUserDoc(firebaseUser, provider);

          // Only update if this is still the current user and component is mounted
          if (isMounted && currentUserId === userId) {
            setUser(user);
          }
        } catch (error) {
          console.error("Failed to initialize user:", error);
          if (isMounted && currentUserId === userId) {
            setUser(null);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
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
