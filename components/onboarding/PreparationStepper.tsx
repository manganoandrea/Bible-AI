import { View, Text } from "react-native";
import { useEffect, useState, useRef } from "react";

const STEPS = [
  "Setting your Companion",
  "Loading illustrations",
  "Getting the narrator ready",
  "Building your story paths",
];

const DELIGHT_LINES = [
  "Your Companion is packing their satchel...",
  "Choosing a cozy sky...",
  "Finding the kindest path...",
  "Painting with watercolors...",
];

interface PreparationStepperProps {
  onComplete: () => void;
  isRealProgress?: boolean;
  progress?: number;
}

export function PreparationStepper({
  onComplete,
  isRealProgress = false,
  progress = 0,
}: PreparationStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [delightIndex, setDelightIndex] = useState(0);

  useEffect(() => {
    if (isRealProgress) return;

    // Simulated progress for onboarding cover generation
    const stepDuration = 600;
    let completionTimeout: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer);
          completionTimeout = setTimeout(onComplete, 400);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => {
      clearInterval(timer);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [isRealProgress, onComplete]);

  useEffect(() => {
    if (isRealProgress) {
      const step = Math.min(
        Math.floor(progress * STEPS.length),
        STEPS.length - 1
      );
      setCurrentStep(step);
      if (progress >= 1) onComplete();
    }
  }, [isRealProgress, progress, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDelightIndex((prev) => (prev + 1) % DELIGHT_LINES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="items-center">
      <View className="w-full gap-4">
        {STEPS.map((step, i) => (
          <View key={step} className="flex-row items-center gap-3">
            <View
              className={`w-6 h-6 rounded-full items-center justify-center ${
                i <= currentStep ? "bg-gold" : "bg-light-gray"
              }`}
            >
              {i < currentStep ? (
                <Text className="text-white text-xs font-nunito-bold">✓</Text>
              ) : (
                <Text className="text-white text-xs font-nunito-bold">
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              className={`font-nunito text-base ${
                i <= currentStep ? "text-charcoal" : "text-light-gray"
              }`}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>

      <Text className="font-nunito text-sm text-warm-gray mt-8 italic text-center">
        {DELIGHT_LINES[delightIndex]}
      </Text>
    </View>
  );
}
