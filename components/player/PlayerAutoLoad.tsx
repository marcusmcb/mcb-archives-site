"use client";

import { useEffect } from "react";

import { useAudioPlayer, type PlayerShow } from "./AudioPlayerProvider";

type Props = {
  show: PlayerShow | null;
};

export const PlayerAutoLoad = ({ show }: Props) => {
  const { current, loadShow } = useAudioPlayer();

  useEffect(() => {
    if (current) return;
    if (!show) return;
    loadShow(show);
  }, [current, loadShow, show]);

  return null;
};
