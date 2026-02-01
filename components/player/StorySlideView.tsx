import { View, Image } from "react-native";
import { TextBubble } from "./TextBubble";

interface StorySlideViewProps {
  imageUrl: string;
  text: string;
  showText: boolean;
}

export function StorySlideView({
  imageUrl,
  text,
  showText,
}: StorySlideViewProps) {
  return (
    <View className="flex-1">
      {/* TODO: Replace placeholder with actual AI-generated illustration */}
      <View className="flex-1 bg-charcoal items-center justify-center">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gold/20" />
        )}
      </View>

      <TextBubble text={text} visible={showText} />
    </View>
  );
}
