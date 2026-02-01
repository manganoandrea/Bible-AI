import { Pressable, Text, type PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}

export function Button({
  title,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const baseClasses = "w-full items-center justify-center rounded-2xl min-h-[52px] px-6";
  const variantClasses = {
    primary: "bg-gold",
    secondary: "bg-white border border-light-gray",
    ghost: "bg-transparent",
  };
  const textClasses = {
    primary: "text-white font-nunito-bold text-lg",
    secondary: "text-charcoal font-nunito-semibold text-lg",
    ghost: "text-warm-gray font-nunito-semibold text-base",
  };

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50" : ""}`}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      disabled={disabled}
      {...props}
    >
      <Text className={textClasses[variant]}>{title}</Text>
    </AnimatedPressable>
  );
}
