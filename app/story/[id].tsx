import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-charcoal items-center justify-center">
      <Text className="font-nunito-bold text-2xl text-white">
        Story Player: {id}
      </Text>
    </View>
  );
}
