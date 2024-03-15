import { create } from "zustand";

type Store = {
  // confetti
  isOpenConfetti: boolean;
  onOpenConfetti: () => void;
  onCloseConfetti: () => void;
};

export const useConfetti = create<Store>((set) => ({
  isOpenConfetti: false,
  onOpenConfetti: () => set({ isOpenConfetti: true }),
  onCloseConfetti: () => set({ isOpenConfetti: false }),
}));
