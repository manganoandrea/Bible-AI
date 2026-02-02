import { create } from "zustand";

interface SubscriptionState {
  isPremium: boolean;
  storiesRemainingThisMonth: number;
  isLoading: boolean;

  setPremium: (isPremium: boolean) => void;
  setStoriesRemaining: (count: number) => void;
  decrementStories: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  storiesRemainingThisMonth: 0,
  isLoading: true,

  setPremium: (isPremium) =>
    set({
      isPremium,
      storiesRemainingThisMonth: isPremium ? 4 : 0,
    }),
  setStoriesRemaining: (storiesRemainingThisMonth) =>
    set({ storiesRemainingThisMonth }),
  decrementStories: () =>
    set((s) => ({
      storiesRemainingThisMonth: Math.max(
        0,
        s.storiesRemainingThisMonth - 1
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
