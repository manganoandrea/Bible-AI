import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center">
      <Text className="font-nunito-bold text-2xl text-charcoal">
        Bible-AI
      </Text>
      <Text className="font-nunito text-warm-gray mt-2">
        Welcome screen placeholder
      </Text>
    </SafeAreaView>
  );
}
