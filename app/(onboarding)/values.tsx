import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";
import { ALL_VALUES, type Value } from "@/types";

export default function ValuesScreen() {
  const router = useRouter();
  const { values, toggleValue } = useOnboardingStore();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          What values do you want to practice?
        </Text>
        <Text className="font-nunito text-sm text-warm-gray mt-2">
          Pick up to 3. Your child's choices will reinforce these values.
        </Text>

        <View className="flex-row flex-wrap gap-3 mt-8">
          {ALL_VALUES.map((value) => {
            const isSelected = values.includes(value);
            const isDisabled = !isSelected && values.length >= 3;

            return (
              <Pressable
                key={value}
                className={`px-5 py-3 rounded-full border ${
                  isSelected
                    ? "bg-gold border-gold"
                    : isDisabled
                      ? "bg-white border-light-gray opacity-40"
                      : "bg-white border-light-gray"
                }`}
                onPress={() => toggleValue(value)}
                disabled={isDisabled}
              >
                <Text
                  className={`font-nunito-semibold text-sm ${
                    isSelected ? "text-white" : "text-charcoal"
                  }`}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {values.length > 0 && (
          <Text className="font-nunito text-xs text-warm-gray mt-4">
            Selected: {values.join(", ")} ({values.length}/3)
          </Text>
        )}
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Continue"
          disabled={values.length === 0}
          onPress={() => router.push("/(onboarding)/preparation")}
        />
      </View>
    </SafeAreaView>
  );
}
