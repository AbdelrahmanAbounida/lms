"use client";

import ReactConfetti from "react-confetti";

import { useConfetti } from "@/hooks/use-confetti";

export const ConfettiProvider = () => {
  const store = useConfetti();

  if (!store.isOpenConfetti) return null;

  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        store.onCloseConfetti();
      }}
    />
  );
};
