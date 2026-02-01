import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";
import type { AgeBand } from "@/types";

const AGE_BANDS: { label: string; value: AgeBand }[] = [
  { label: "3–5", value: "3-5" },
  { label: "6–8", value: "6-8" },
  { label: "9–11", value: "9-11" },
];

export default function ChildProfileScreen() {
  const router = useRouter();
  const { childName, ageBand, setChildName, setAgeBand } =
    useOnboardingStore();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          Who are we reading for?
        </Text>

        <View className="mt-8">
          <Text className="font-nunito-semibold text-sm text-warm-gray mb-2">
            Child's nickname (optional)
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-nunito text-base text-charcoal border border-light-gray"
            placeholder="e.g., Mia"
            placeholderTextColor="#B2BEC3"
            value={childName}
            onChangeText={setChildName}
          />
        </View>

        <View className="mt-6">
          <Text className="font-nunito-semibold text-sm text-warm-gray mb-2">
            Age band
          </Text>
          <View className="flex-row gap-3">
            {AGE_BANDS.map((band) => (
              <Pressable
                key={band.value}
                className={`flex-1 items-center py-3 rounded-xl border ${
                  ageBand === band.value
                    ? "bg-gold border-gold"
                    : "bg-white border-light-gray"
                }`}
                onPress={() => setAgeBand(band.value)}
              >
                <Text
                  className={`font-nunito-bold text-base ${
                    ageBand === band.value ? "text-white" : "text-charcoal"
                  }`}
                >
                  {band.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="font-nunito text-xs text-warm-gray mt-2">
            Age sets vocabulary, length, and choices.
          </Text>
        </View>
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Continue"
          disabled={!ageBand}
          onPress={() => router.push("/(onboarding)/companion")}
        />
      </View>
    </SafeAreaView>
  );
}
