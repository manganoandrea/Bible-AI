import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CreateStoryCardProps {
  companionName: string;
  onPress: () => void;
}

export function CreateStoryCard({
  companionName,
  onPress,
}: CreateStoryCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-full bg-white rounded-3xl shadow-sm overflow-hidden"
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      {/* TODO: Replace with watercolor companion illustration */}
      <View className="w-full h-48 bg-gold/10 items-center justify-center">
        <Text className="text-6xl">✨</Text>
      </View>
      <View className="p-5">
        <Text className="font-nunito-bold text-xl text-charcoal">
          Create tonight's story
        </Text>
        <Text className="font-nunito text-sm text-warm-gray mt-1">
          A new adventure with {companionName}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
