import { create } from "zustand";
import type { Story } from "@/types";

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  isGenerating: boolean;

  setStories: (stories: Story[]) => void;
  setCurrentStory: (story: Story | null) => void;
  setGenerating: (generating: boolean) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  currentStory: null,
  isGenerating: false,

  setStories: (stories) => set({ stories }),
  setCurrentStory: (story) => set({ currentStory: story }),
  setGenerating: (isGenerating) => set({ isGenerating }),

  addStory: (story) =>
    set((s) => ({ stories: [story, ...s.stories] })),

  updateStory: (id, updates) =>
    set((s) => ({
      stories: s.stories.map((story) =>
        story.id === id ? { ...story, ...updates } : story
      ),
      currentStory:
        s.currentStory?.id === id
          ? { ...s.currentStory, ...updates }
          : s.currentStory,
    })),
}));
