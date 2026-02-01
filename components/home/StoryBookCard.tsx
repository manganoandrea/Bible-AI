import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StoryBookCardProps {
  title: string;
  coverImageUrl: string;
  valuesReinforced: string[];
  onPress: () => void;
}

export function StoryBookCard({
  title,
  valuesReinforced,
  onPress,
}: StoryBookCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-36 mr-4"
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      {/* TODO: Replace with actual cover image */}
      <View className="w-36 h-48 bg-white rounded-2xl shadow-sm items-center justify-center overflow-hidden">
        <View className="flex-1 w-full bg-gold/10 items-center justify-center">
          <Text className="text-4xl">📖</Text>
        </View>
      </View>
      <Text
        className="font-nunito-semibold text-sm text-charcoal mt-2"
        numberOfLines={1}
      >
        {title}
      </Text>
      {valuesReinforced.length > 0 && (
        <Text className="font-nunito text-xs text-warm-gray" numberOfLines={1}>
          {valuesReinforced.join(" · ")}
        </Text>
      )}
    </AnimatedPressable>
  );
}
