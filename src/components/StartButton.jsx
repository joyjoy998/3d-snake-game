import { Play } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export default function StartButton({ onStart }) {
  const currentPalette = useGameStore((state) => state.currentPalette);

  const paletteBackgrounds = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <button
      id="btn-play"
      className="fixed w-max drop-shadow-xl top-[55%] lg:top-[40%] p-0 m-0 left-1/2 -translate-x-1/2 border-none bg-transparent"
      onClick={onStart}
    >
      <div
        className={`
          relative 
          flex items-center justify-center 
          px-8 py-6 
          ${paletteBackgrounds[currentPalette]}
          border-4 border-white border-opacity-40 
          rounded-xl
          shadow-lg
          transition-transform duration-200 ease-in-out
          hover:translate-y-[-2px] hover:shadow-xl
          active:translate-y-[1px] active:shadow-md
        `}
      >
        {/* 左上角的亮光效果 */}
        <div
          className="
            absolute top-0 left-0 
            w-full h-full 
            bg-gradient-to-br from-white/25 to-transparent
            rounded-xl
          "
        />

        {/* 文本和图标容器 */}
        <span
          className="
            relative z-10 
            flex items-center gap-3
            text-white text-5xl font-bold tracking-wider 
            uppercase 
            drop-shadow-md 
            pointer-events-none 
            select-none
          "
        >
          Play
          <Play className="w-10 h-10" color="white" />
        </span>
      </div>
    </button>
  );
}
