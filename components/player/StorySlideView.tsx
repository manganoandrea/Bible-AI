import { View, Image, ActivityIndicator, Text, Pressable } from "react-native";
import { TextBubble } from "./TextBubble";
import { useStoryAudio } from "@/hooks/useStoryAudio";

type ImageStatus = "pending" | "generating" | "ready" | "failed";
type AudioStatus = "pending" | "generating" | "ready" | "failed";

interface StorySlideViewProps {
  imageUrl: string;
  imageStatus: ImageStatus;
  audioUrl: string;
  audioStatus: AudioStatus;
  text: string;
  showText: boolean;
}

export function StorySlideView({
  imageUrl,
  imageStatus,
  audioUrl,
  audioStatus,
  text,
  showText,
}: StorySlideViewProps) {
  const { isPlaying, isLoaded, play, pause, replay } = useStoryAudio({
    audioUrl,
    audioStatus,
    autoPlay: true,
  });

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

      {/* Audio controls */}
      {audioStatus === "ready" && isLoaded && (
        <View className="absolute top-4 right-4 flex-row gap-2">
          <Pressable
            onPress={isPlaying ? pause : play}
            className="bg-white/80 rounded-full w-10 h-10 items-center justify-center"
          >
            <Text className="text-lg">{isPlaying ? "⏸" : "▶️"}</Text>
          </Pressable>
          <Pressable
            onPress={replay}
            className="bg-white/80 rounded-full w-10 h-10 items-center justify-center"
          >
            <Text className="text-lg">🔄</Text>
          </Pressable>
        </View>
      )}

      <TextBubble text={text} visible={showText} />
    </View>
  );
}
