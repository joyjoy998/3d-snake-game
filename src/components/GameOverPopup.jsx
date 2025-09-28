import { useGameStore } from "../store/gameStore";
import { RotateCcw } from "lucide-react";

export default function GameOver({ score, onRestart }) {
  const highestScore = useGameStore((state) => state.highestScore);
  const currentPalette = useGameStore((state) => state.currentPalette);
  if (highestScore < score) {
    useGameStore.getState().setHighestScore(score);
  }

  return (
    <div
      className="
        fixed inset-0 
        flex items-center justify-center         
        z-50
      "
    >
      <div
        className={`
          bg-${currentPalette}/10 backdrop-blur-md 
          p-8 md:p-12
          rounded-2xl 
          shadow-2xl 
          text-center text-white
          min-w-[300px]
          border border-white/20
          uppercase
        `}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Game Over😵</h2>

        <div className="space-y-4 mb-8">
          <div className="text-1xl md:text-2xl">
            Score: <span className="font-semibold">{score}</span>
          </div>
          {highestScore > score && (
            <>
              <div className="text-xl md:text-2xl">
                High Score:{" "}
                <span className="font-semibold">{highestScore}</span>
              </div>
              <div className="text-xl md:text-2xl text-red-500 font-bold animate-pulse">
                Let's try again! ✊
              </div>
            </>
          )}
          {highestScore <= score && (
            <div className="text-xl md:text-2xl text-yellow-400 font-bold animate-pulse">
              New High Score! 🏆
            </div>
          )}
        </div>

        <button
          onClick={onRestart}
          className={`
            bg-${currentPalette}/20 
            hover:bg-white/30 
            backdrop-blur 
            px-3 py-2
            rounded-full 
            font-semibold 
            transition-all duration-200
            hover:scale-105 
            active:scale-95
            text-lg md:text-xl
          `}
        >
          <RotateCcw className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
