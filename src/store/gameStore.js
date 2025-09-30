import { create } from "zustand";

const initialState = {
  currentPalette: "green",
  score: 0,
  highestScore: 0,
  isGameOver: false,
  isGameStarted: false,
  isHeadFollowMode: false,
};

const getStoredState = () => {
  try {
    const isStateStored = localStorage.getItem("live-snake-state-storage");
    if (isStateStored) {
      const storedState = JSON.parse(isStateStored);
      return {
        ...initialState,
        highestScore: storedState.highestScore,
      };
    }
  } catch (error) {
    console.error("Error parsing stored state:", error);
  }
  return initialState;
};

export const useGameStore = create((set, get) => ({
  ...getStoredState(),
  setHighestScore: (score) => {
    set({ highestScore: score });
    localStorage.setItem("live-snake-state-storage", JSON.stringify(get()));
  },
  setScore: (score) => {
    set({ score: score });
  },
  setCurrentPalette: (paletteColor) => {
    set({ currentPalette: paletteColor });
  },
  setIsGameOver: (status) => {
    set({ isGameOver: status });
  },
  setIsGameStarted: (status) => {
    set({ isGameStarted: status });
  },
  setIsHeadFollowMode: (status) => {
    set({ isHeadFollowMode: status });
  },
}));
