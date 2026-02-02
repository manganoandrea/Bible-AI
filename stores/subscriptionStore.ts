import { create } from "zustand";

const PREMIUM_MONTHLY_STORIES = 4;

interface SubscriptionState {
  isPremium: boolean;
  storiesRemainingThisMonth: number;
  isLoading: boolean;
  error: string | null;

  setPremium: (isPremium: boolean) => void;
  setStoriesRemaining: (count: number) => void;
  decrementStories: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  storiesRemainingThisMonth: 0,
  isLoading: true,
  error: null,

  setPremium: (isPremium) =>
    set({
      isPremium,
      storiesRemainingThisMonth: isPremium ? PREMIUM_MONTHLY_STORIES : 0,
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
  setError: (error) => set({ error }),
}));
