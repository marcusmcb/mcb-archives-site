"use client";

import Link from "next/link";

import { useAudioPlayer } from "./AudioPlayerProvider";

const fmt = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

export const AudioPlayerBar = () => {
  const { current, isPlaying, duration, currentTime, togglePlay, seek } = useAudioPlayer();

  const hasShow = Boolean(current);

  return (
    <div className="playerBar" aria-label="Site audio player">
      <div className="playerLeft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {current?.image ? <img className="playerArt" src={current.image} alt="" aria-hidden="true" /> : <div className="playerArtPlaceholder" />}

        <div className="playerMeta">
          <div className="playerTitle">{current ? current.title : "Nothing playing"}</div>
          {current ? (
            <div className="playerSub">
              <Link className="pill" href={`/shows/${encodeURIComponent(current.id)}`}>
                View show
              </Link>
            </div>
          ) : (
            <div className="playerSub">Select a show and press “Listen Now”.</div>
          )}
        </div>
      </div>

      <div className="playerControls">
        <button className="actionBtn" type="button" disabled={!hasShow} onClick={togglePlay}>
          <span aria-hidden="true">{isPlaying ? "⏸" : "▶"}</span>
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <div className="playerTimeline">
          <div className="playerTime">{fmt(currentTime)}</div>
          <input
            aria-label="Seek"
            type="range"
            min={0}
            max={duration > 0 ? duration : 0}
            step={1}
            value={duration > 0 ? Math.min(currentTime, duration) : 0}
            disabled={!hasShow || duration <= 0}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <div className="playerTime">{fmt(duration)}</div>
        </div>
      </div>
    </div>
  );
};
