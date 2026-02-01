import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useProfileStore, useStoryStore } from "@/stores";
import { CreateStoryCard } from "@/components/home/CreateStoryCard";
import { StoryBookCard } from "@/components/home/StoryBookCard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const stories = useStoryStore((s) => s.stories);

  const childName = profile?.childName || "friend";
  const companionName =
    profile?.companionName ||
    profile?.companionType?.charAt(0).toUpperCase() +
      (profile?.companionType?.slice(1) || "") ||
    "Companion";

  const handleCreateStory = () => {
    // TODO: Trigger generation pipeline, navigate to preparation screen
    router.push("/story/new-story");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View className="flex-row items-center gap-3">
            {/* TODO: Replace with companion avatar */}
            <View className="w-10 h-10 bg-gold/20 rounded-full items-center justify-center">
              <Text className="text-lg">🐑</Text>
            </View>
            <View>
              <Text className="font-nunito-bold text-lg text-charcoal">
                {getGreeting()}, {childName}
              </Text>
              <Text className="font-nunito text-sm text-warm-gray">
                Ready for a story?
              </Text>
            </View>
          </View>
          <Pressable
            className="w-10 h-10 items-center justify-center"
            onPress={() => {
              // TODO: Open settings sheet
            }}
          >
            <Text className="text-warm-gray text-xl">⚙</Text>
          </Pressable>
        </View>

        {/* Create Story Card */}
        <View className="px-6 mt-4">
          <CreateStoryCard
            companionName={companionName}
            onPress={handleCreateStory}
          />
        </View>

        {/* Past Stories */}
        {stories.length > 0 ? (
          <View className="mt-8">
            <Text className="font-nunito-bold text-lg text-charcoal px-6 mb-3">
              Your stories
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {stories.map((story) => (
                <StoryBookCard
                  key={story.id}
                  title={story.title}
                  coverImageUrl={story.coverImageUrl}
                  valuesReinforced={story.valuesReinforced}
                  onPress={() => router.push(`/story/${story.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="mt-8 px-6">
            <Text className="font-nunito-bold text-lg text-charcoal mb-3">
              Your stories
            </Text>
            <View className="bg-white rounded-2xl p-6 items-center">
              <Text className="text-4xl mb-3">📚</Text>
              <Text className="font-nunito-semibold text-base text-charcoal">
                Your first story is waiting
              </Text>
              <Text className="font-nunito text-sm text-warm-gray mt-1 text-center">
                Create a story above to start your library
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
