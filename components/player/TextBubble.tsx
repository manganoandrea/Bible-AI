import { Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface TextBubbleProps {
  text: string;
  visible: boolean;
}

export function TextBubble({ text, visible }: TextBubbleProps) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      className="absolute bottom-12 left-6 right-6 bg-charcoal/60 rounded-2xl px-6 py-4"
    >
      <Text className="font-nunito-semibold text-lg text-white text-center leading-7">
        {text}
      </Text>
    </Animated.View>
  );
}
