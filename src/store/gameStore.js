import { create } from "zustand";

const initialState = {
  currentPalette: "green",
  highestScore: 0,
  isGameOver: false,
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
  setCurrentPalette: (paletteColor) => {
    set({ currentPalette: paletteColor });
  },
  setIsGameOver: (status) => {
    set({ isGameOver: status });
  },
}));
