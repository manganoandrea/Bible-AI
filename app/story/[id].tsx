import { View, Pressable, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback, useEffect, useMemo } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StorySlideView } from "@/components/player/StorySlideView";
import { subscribeToStory } from "@/lib/firebaseStory";
import type { Story, StorySlide } from "@/types";

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideHistory, setSlideHistory] = useState<string[]>([]);
  const [showText, setShowText] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Combine slides and branchSlides into a single lookup map
  const allSlides = useMemo(() => {
    if (!story) return new Map<string, StorySlide>();
    const map = new Map<string, StorySlide>();
    story.slides.forEach((slide) => map.set(slide.slideId, slide));
    story.branchSlides?.forEach((slide) => map.set(slide.slideId, slide));
    return map;
  }, [story]);

  // Subscribe to story updates from Firestore
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    const unsubscribe = subscribeToStory(id, (updatedStory) => {
      setStory(updatedStory);
      setIsLoading(false);

      // Initialize slide history with first slide if not set
      if (updatedStory?.slides.length && slideHistory.length === 0) {
        setSlideHistory([updatedStory.slides[0].slideId]);
      }
    });

    return () => unsubscribe();
  }, [id]);

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
  const currentSlide = currentSlideId ? allSlides.get(currentSlideId) : null;

  const handleNext = useCallback(() => {
    if (!currentSlide || currentSlide.isChoicePoint || !story) return;

    // Find next slide in the main slides array
    const currentIdx = story.slides.findIndex(
      (s) => s.slideId === currentSlideId
    );

    if (currentIdx >= 0 && currentIdx < story.slides.length - 1) {
      const nextSlide = story.slides[currentIdx + 1];
      const newHistory = [...slideHistory.slice(0, currentSlideIndex + 1), nextSlide.slideId];
      setSlideHistory(newHistory);
      setCurrentSlideIndex(newHistory.length - 1);
    }
  }, [currentSlide, currentSlideId, currentSlideIndex, slideHistory, story]);

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

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 bg-charcoal items-center justify-center">
        <ActivityIndicator size="large" color="#FFB356" />
        <Text className="font-nunito text-cream mt-4">Loading story...</Text>
      </View>
    );
  }

  // Error state - story not found
  if (!story) {
    return (
      <View className="flex-1 bg-charcoal items-center justify-center">
        <Text className="font-nunito text-cream text-lg">Story not found</Text>
        <Pressable
          className="mt-4 bg-gold px-6 py-3 rounded-full"
          onPress={handleClose}
        >
          <Text className="font-nunito-bold text-charcoal">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  // Still generating - no slides yet
  if (!currentSlide) {
    return (
      <View className="flex-1 bg-charcoal items-center justify-center">
        <ActivityIndicator size="large" color="#FFB356" />
        <Text className="font-nunito text-cream mt-4">
          {story.status === "generating"
            ? "Creating your story..."
            : story.status === "text_ready"
            ? "Generating cover..."
            : story.status === "cover_ready"
            ? "Creating illustrations..."
            : "Loading..."}
        </Text>
        <Text className="font-nunito text-warm-gray mt-2 text-sm">
          {story.imagesGenerated || 0} of {story.totalImages || "?"} images ready
        </Text>
      </View>
    );
  }

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
