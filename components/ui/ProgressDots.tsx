import { View } from "react-native";

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${
            i === current ? "w-6 bg-gold" : "w-2 bg-light-gray"
          }`}
        />
      ))}
    </View>
  );
}
