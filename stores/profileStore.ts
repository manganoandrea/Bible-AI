import { create } from "zustand";
import type { Profile } from "@/types";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;

  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
