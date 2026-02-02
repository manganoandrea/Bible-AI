import { Redirect } from "expo-router";
import { useAuthStore, useProfileStore } from "@/stores";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { profile } = useProfileStore();

  if (authLoading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator color="#FFB356" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  if (!profile) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(main)/home" />;
}
