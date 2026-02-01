import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { CompanionType, CompanionTrait } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CompanionCardProps {
  type: CompanionType;
  trait: CompanionTrait;
  isSelected: boolean;
  onPress: () => void;
}

const COMPANION_EMOJI: Record<CompanionType, string> = {
  lamb: "🐑",
  lion: "🦁",
  donkey: "🫏",
  horse: "🐴",
};

export function CompanionCard({
  type,
  trait,
  isSelected,
  onPress,
}: CompanionCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`flex-1 items-center p-4 rounded-2xl border-2 ${
        isSelected ? "bg-gold/10 border-gold" : "bg-white border-light-gray"
      }`}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      {/* TODO: Replace emoji with watercolor companion illustration */}
      <Text className="text-5xl mb-2">{COMPANION_EMOJI[type]}</Text>
      <Text className="font-nunito-bold text-base text-charcoal capitalize">
        {type}
      </Text>
      <View className="bg-gold/20 rounded-full px-3 py-1 mt-1">
        <Text className="font-nunito-semibold text-xs text-gold">
          {trait}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
