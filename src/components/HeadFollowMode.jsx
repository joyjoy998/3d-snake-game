import { Eye, EyeOff } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export default function HeadFollowMode() {
  const isHeadFollowMode = useGameStore((state) => state.isHeadFollowMode);
  const setIsHeadFollowMode = useGameStore(
    (state) => state.setIsHeadFollowMode
  );

  return (
    <button
      className="absolute bottom-16 right-4 bg-transparent hover:bg-white/10 rounded-full p-2"
      onClick={() => setIsHeadFollowMode(!isHeadFollowMode)}
    >
      {isHeadFollowMode ? (
        <Eye className="text-white" />
      ) : (
        <EyeOff className="text-gray-500" />
      )}
    </button>
  );
}
