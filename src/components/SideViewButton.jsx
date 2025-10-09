import { ArrowUpLeft, ArrowDownRight } from "lucide-react";
import { useGameStore } from "../store/gameStore";

export default function SideViewButton() {
  const isHeadFollowMode = useGameStore((state) => state.isHeadFollowMode);
  const isSideViewChanged = useGameStore((state) => state.isSideViewChanged);
  const setIsSideViewChanged = useGameStore(
    (state) => state.setIsSideViewChanged
  );

  return (
    <>
      {isHeadFollowMode && (
        <button
          className="absolute bottom-28 right-4 bg-transparent hover:bg-white/10 rounded-full p-2"
          onClick={() => setIsSideViewChanged(!isSideViewChanged)}
        >
          {isSideViewChanged ? (
            <ArrowDownRight className="text-white" />
          ) : (
            <ArrowUpLeft className="text-gray-500" />
          )}
        </button>
      )}
    </>
  );
}
