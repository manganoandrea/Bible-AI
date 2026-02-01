import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";
import { CompanionCard } from "@/components/onboarding/CompanionCard";
import { COMPANIONS, type CompanionType } from "@/types";

const companionEntries = Object.entries(COMPANIONS) as [
  CompanionType,
  (typeof COMPANIONS)[CompanionType],
][];

export default function CompanionScreen() {
  const router = useRouter();
  const { companionType, companionName, setCompanionType, setCompanionName } =
    useOnboardingStore();
  const [showNameInput, setShowNameInput] = useState(false);

  const handleSelect = (type: CompanionType) => {
    setCompanionType(type);
    setShowNameInput(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          Choose a Companion
        </Text>

        <View className="flex-row flex-wrap gap-3 mt-8">
          {companionEntries.map(([type, data]) => (
            <View key={type} className="w-[48%]">
              <CompanionCard
                type={type}
                trait={data.trait}
                isSelected={companionType === type}
                onPress={() => handleSelect(type)}
              />
            </View>
          ))}
        </View>

        {showNameInput && (
          <View className="mt-6">
            <Text className="font-nunito-semibold text-sm text-warm-gray mb-2">
              Give your Companion a name (optional)
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 font-nunito text-base text-charcoal border border-light-gray"
              placeholder="e.g., Sunny"
              placeholderTextColor="#B2BEC3"
              value={companionName}
              onChangeText={setCompanionName}
            />
          </View>
        )}
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Choose this Companion"
          disabled={!companionType}
          onPress={() => router.push("/(onboarding)/values")}
        />
      </View>
    </SafeAreaView>
  );
}
