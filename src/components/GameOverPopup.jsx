import { useGameStore } from "../store/gameStore";
import { RotateCcw } from "lucide-react";
import { useEffect, useMemo } from "react";

const outerContourShadow = {
  green: "shadow-[0_0_20px_rgba(22,163,74,0.9)]",
  orange: "shadow-[0_0_20px_rgba(250,204,21,0.8)]",
  purple: "shadow-[0_0_20px_rgba(126,34,206,0.9)]",
};

const backgroundColor = {
  green: "bg-green-500/10",
  orange: "bg-orange-500/10",
  purple: "bg-purple-500/10",
};

export default function GameOver({ score, onRestart }) {
  const currentPalette = useGameStore((state) => state.currentPalette);
  const highestScore = useGameStore((state) => state.highestScore);
  const isGameOver = useGameStore((state) => state.isGameOver);

  const isHighScore = highestScore === score && score !== 0;

  const resultBGM = isHighScore ? "high_score.mp3" : "not_high_score.mp3";

  const audio = useMemo(() => {
    const newAudio = new Audio(resultBGM);
    newAudio.volume = 0.1;
    return newAudio;
  }, [resultBGM]);

  useEffect(() => {
    if (isGameOver) {
      audio.play();
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isGameOver, audio]);

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
          ${backgroundColor[currentPalette]} backdrop-blur-md 
          p-8 md:p-12
          rounded-2xl 
          shadow-2xl 
          text-center text-white
          min-w-[300px]
          border border-white/20
          ${outerContourShadow[currentPalette]}
        `}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-1 uppercase">
          Game Over{isHighScore ? "🥹" : "😵"}
        </h2>
        {isHighScore && (
          <>
            <div className="text-xl md:text-2xl text-red-500 font-bold mb-2">
              but🚀
            </div>
            <div className="text-3xl md:text-4xl text-yellow-400 font-bold animate-pulse mb-2">
              New High Score! 🏆
            </div>
            <div className="text-3xl md:text-4xl mb-2 font-bold text-yellow-400">
              High Score: <span className="font-semibold">{highestScore}</span>
            </div>
          </>
        )}

        {!isHighScore && (
          <div className="space-y-4 mb-2">
            <div className="text-1xl md:text-2xl mb-2 text-blue-500 font-bold">
              Score: <span className="font-semibold">{score}</span>
            </div>
            <div className="text-xl md:text-2xl mb-2 font-bold text-yellow-400">
              High Score: <span className="font-semibold">{highestScore}</span>
            </div>
            <div className="text-xl md:text-2xl text-red-500 font-bold animate-pulse">
              Let's try again! ✊
            </div>
          </div>
        )}

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
          <RotateCcw className={`w-8 h-8  animate-bounce`} />
        </button>
      </div>
    </div>
  );
}
