import { useEffect, useMemo } from "react";
import { Music as MusicIcon, Pause } from "lucide-react";

export default function Music({ isMusicPlaying, setIsMusicPlaying }) {
  const audio = useMemo(() => {
    const newAudio = new Audio("background.mp3");
    newAudio.loop = true;
    newAudio.volume = 0.5;
    return newAudio;
  }, []);

  useEffect(() => {
    if (isMusicPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isMusicPlaying, audio]);

  return (
    <button
      className="absolute bottom-4 right-4 bg-transparent hover:bg-white/10 rounded-full p-2"
      onClick={() => setIsMusicPlaying(!isMusicPlaying)}
    >
      {isMusicPlaying ? <Pause /> : <MusicIcon />}
    </button>
  );
}
