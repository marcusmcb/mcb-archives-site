"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type PlayerShow = {
  id: string;
  title: string;
  audioUrl: string;
  image?: string;
};

type AudioPlayerState = {
  current: PlayerShow | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  loadShow: (show: PlayerShow) => void;
  playShow: (show: PlayerShow) => void;
  togglePlay: () => void;
  pause: () => void;
  seek: (t: number) => void;
};

const Ctx = createContext<AudioPlayerState | null>(null);

export const useAudioPlayer = (): AudioPlayerState => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return v;
};

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<PlayerShow | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const loadShow = (show: PlayerShow) => {
    const audio = audioRef.current;
    if (!audio) return;

    const isSame = current?.id === show.id && audio.src === show.audioUrl;

    setCurrent(show);

    if (!isSame) {
      audio.src = show.audioUrl;
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const playShow = (show: PlayerShow) => {
    loadShow(show);

    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => {
      // Autoplay may be blocked; user can press play.
    });
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => {
        // ignore
      });
    } else {
      audio.pause();
    }
  };

  const seek = (t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!Number.isFinite(t)) return;
    audio.currentTime = Math.max(0, t);
  };

  const value = useMemo<AudioPlayerState>(
    () => ({ current, isPlaying, duration, currentTime, loadShow, playShow, togglePlay, pause, seek }),
    [current, isPlaying, duration, currentTime]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" style={{ display: "none" }} />
    </Ctx.Provider>
  );
};
