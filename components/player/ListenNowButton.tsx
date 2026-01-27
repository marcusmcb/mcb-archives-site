"use client";

import { useMemo } from "react";

import { useAudioPlayer, type PlayerShow } from "./AudioPlayerProvider";

type Props = {
  show: {
    id: string;
    title: string;
    audio_file_link: string;
    image?: string;
  };
  compact?: boolean;
};

export const ListenNowButton = ({ show, compact }: Props) => {
  const { current, playShow } = useAudioPlayer();

  const isCurrent = current?.id === show.id;

  const payload = useMemo<PlayerShow>(
    () => ({
      id: show.id,
      title: show.title,
      audioUrl: show.audio_file_link,
      image: show.image
    }),
    [show.audio_file_link, show.id, show.image, show.title]
  );

  return (
    <button
      className={compact ? "actionBtn" : "actionBtn listenNowPrimary"}
      type="button"
      onClick={() => playShow(payload)}
      style={compact ? { padding: "8px 10px" } : undefined}
      aria-label={isCurrent ? "Play this show (currently selected)" : "Play this show"}
      title={isCurrent ? "Now playing" : "Listen now"}
    >
      <span aria-hidden="true">▶</span>
      {!compact ? <span>{isCurrent ? "Playing" : "Listen Now"}</span> : null}
    </button>
  );
};
