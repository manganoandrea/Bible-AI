import { View, Image, ActivityIndicator, Text } from "react-native";
import { TextBubble } from "./TextBubble";

type ImageStatus = "pending" | "generating" | "ready" | "failed";

interface StorySlideViewProps {
  imageUrl: string;
  imageStatus: ImageStatus;
  text: string;
  showText: boolean;
}

export function StorySlideView({
  imageUrl,
  imageStatus,
  text,
  showText,
}: StorySlideViewProps) {
  const renderImage = () => {
    // Show image if ready and URL exists
    if (imageStatus === "ready" && imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      );
    }

    // Show loading for pending or generating
    if (imageStatus === "pending" || imageStatus === "generating") {
      return (
        <View className="flex-1 bg-gold/10 items-center justify-center">
          <ActivityIndicator size="large" color="#FFB356" />
          <Text className="font-nunito text-sm text-warm-gray mt-4">
            Creating illustration...
          </Text>
        </View>
      );
    }

    // Show error state for failed
    if (imageStatus === "failed") {
      return (
        <View className="flex-1 bg-cream items-center justify-center">
          <Text className="text-4xl mb-2">🎨</Text>
          <Text className="font-nunito text-sm text-warm-gray">
            Illustration unavailable
          </Text>
        </View>
      );
    }

    // Fallback placeholder
    return <View className="flex-1 bg-gold/20" />;
  };

  return (
    <View className="flex-1">
      <View className="flex-1 bg-charcoal items-center justify-center">
        {renderImage()}
      </View>
      <TextBubble text={text} visible={showText} />
    </View>
  );
}
