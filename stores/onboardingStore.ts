import { create } from "zustand";
import type { AgeBand, CompanionType, Value } from "@/types";

interface OnboardingState {
  childName: string;
  ageBand: AgeBand | null;
  companionType: CompanionType | null;
  companionName: string;
  values: Value[];
  currentStep: number;

  setChildName: (name: string) => void;
  setAgeBand: (band: AgeBand) => void;
  setCompanionType: (type: CompanionType) => void;
  setCompanionName: (name: string) => void;
  toggleValue: (value: Value) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState = {
  childName: "",
  ageBand: null as AgeBand | null,
  companionType: null as CompanionType | null,
  companionName: "",
  values: [] as Value[],
  currentStep: 0,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setChildName: (name) => set({ childName: name }),
  setAgeBand: (band) => set({ ageBand: band }),
  setCompanionType: (type) => set({ companionType: type }),
  setCompanionName: (name) => set({ companionName: name }),

  toggleValue: (value) => {
    const current = get().values;
    if (current.includes(value)) {
      set({ values: current.filter((v) => v !== value) });
    } else if (current.length < 3) {
      set({ values: [...current, value] });
    }
  },

  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  reset: () => set(initialState),
}));
