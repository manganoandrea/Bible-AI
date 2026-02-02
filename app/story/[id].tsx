import { View, Pressable, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StorySlideView } from "@/components/player/StorySlideView";
import type { StorySlide } from "@/types";

// TODO: Replace with real story data from Firestore
const MOCK_SLIDES: StorySlide[] = [
  {
    slideId: "1",
    text: "Once upon a time, in a land of rolling green hills, a little lamb named Sunny set out on an adventure.",
    imageUrl: "",
    imageStatus: "ready",
    audioUrl: "",
    audioStatus: "ready",
    isChoicePoint: false,
  },
  {
    slideId: "2",
    text: "Sunny walked along a winding path, the warm sun painting golden light across the meadow.",
    imageUrl: "",
    imageStatus: "ready",
    audioUrl: "",
    audioStatus: "ready",
    isChoicePoint: false,
  },
  {
    slideId: "3",
    text: "At the crossroads, Sunny saw two paths. One led to a quiet village, the other into a mysterious forest.",
    imageUrl: "",
    imageStatus: "ready",
    audioUrl: "",
    audioStatus: "ready",
    isChoicePoint: true,
    choices: [
      {
        label: "Visit the village",
        iconUrl: "",
        nextSlideId: "4a",
        valueTag: "Kindness",
      },
      {
        label: "Explore the forest",
        iconUrl: "",
        nextSlideId: "4b",
        valueTag: "Courage",
      },
    ],
  },
  {
    slideId: "4a",
    text: "Sunny chose the village, where friendly faces welcomed them with warm smiles. Kindness filled the air.",
    imageUrl: "",
    imageStatus: "ready",
    audioUrl: "",
    audioStatus: "ready",
    isChoicePoint: false,
  },
  {
    slideId: "4b",
    text: "Sunny bravely stepped into the forest, where tall trees whispered ancient stories of courage.",
    imageUrl: "",
    imageStatus: "ready",
    audioUrl: "",
    audioStatus: "ready",
    isChoicePoint: false,
  },
  {
    slideId: "5",
    text: "And so Sunny learned that every choice leads to something wonderful. The end.",
    imageUrl: "",
    imageStatus: "ready",
    audioUrl: "",
    audioStatus: "ready",
    isChoicePoint: false,
  },
];

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideHistory, setSlideHistory] = useState<string[]>(["1"]);
  const [showText, setShowText] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Lock to landscape on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const currentSlideId = slideHistory[currentSlideIndex];
  const currentSlide = MOCK_SLIDES.find((s) => s.slideId === currentSlideId);

  const handleNext = useCallback(() => {
    if (!currentSlide || currentSlide.isChoicePoint) return;

    const currentIdx = MOCK_SLIDES.findIndex(
      (s) => s.slideId === currentSlideId
    );
    const nextSlide = MOCK_SLIDES[currentIdx + 1];
    if (!nextSlide) return;

    const newHistory = [...slideHistory.slice(0, currentSlideIndex + 1), nextSlide.slideId];
    setSlideHistory(newHistory);
    setCurrentSlideIndex(newHistory.length - 1);
  }, [currentSlide, currentSlideId, currentSlideIndex, slideHistory]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  const handleChoice = useCallback(
    (nextSlideId: string) => {
      const newHistory = [...slideHistory.slice(0, currentSlideIndex + 1), nextSlideId];
      setSlideHistory(newHistory);
      setCurrentSlideIndex(newHistory.length - 1);
    },
    [currentSlideIndex, slideHistory]
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (!currentSlide) return null;

  return (
    <View className="flex-1 bg-charcoal">
      <StatusBar hidden />

      <StorySlideView
        imageUrl={currentSlide.imageUrl}
        imageStatus={currentSlide.imageStatus}
        audioUrl={currentSlide.audioUrl}
        audioStatus={currentSlide.audioStatus}
        text={currentSlide.text}
        showText={showText}
      />

      {/* Touch areas for navigation */}
      <View className="absolute inset-0 flex-row">
        {/* Left tap — go back */}
        <Pressable
          className="flex-1"
          onPress={() => {
            setShowControls(true);
            handlePrev();
          }}
        />
        {/* Center tap — toggle controls */}
        <Pressable
          className="flex-[2]"
          onPress={() => setShowControls(!showControls)}
        />
        {/* Right tap — go forward */}
        <Pressable
          className="flex-1"
          onPress={() => {
            setShowControls(true);
            if (!currentSlide.isChoicePoint) handleNext();
          }}
        />
      </View>

      {/* Choice cards */}
      {currentSlide.isChoicePoint && currentSlide.choices && (
        <View className="absolute bottom-8 left-6 right-6 flex-row gap-4">
          {currentSlide.choices.map((choice) => (
            <Pressable
              key={choice.nextSlideId}
              className="flex-1 bg-white/90 rounded-2xl p-4 items-center min-h-[60px] justify-center"
              onPress={() => handleChoice(choice.nextSlideId)}
            >
              <Text className="font-nunito-bold text-sm text-charcoal text-center">
                {choice.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Controls overlay */}
      {showControls && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="absolute top-4 right-4 flex-row gap-3"
        >
          <Pressable
            className="w-10 h-10 bg-charcoal/50 rounded-full items-center justify-center"
            onPress={() => setIsPaused(!isPaused)}
          >
            <Text className="text-white text-sm">
              {isPaused ? "▶" : "⏸"}
            </Text>
          </Pressable>
          <Pressable
            className="w-10 h-10 bg-charcoal/50 rounded-full items-center justify-center"
            onPress={handleClose}
          >
            <Text className="text-white text-sm">✕</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
