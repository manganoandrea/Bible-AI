import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center">
      <Text className="font-nunito-bold text-2xl text-charcoal">Home</Text>
    </SafeAreaView>
  );
}
