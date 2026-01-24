"use client";

import { useEffect, useState } from "react";

import { isFavorite, toggleFavorite } from "../lib/favorites";

export const FavoriteButton = ({ showId, compact }: { showId: string; compact?: boolean }) => {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(showId));
  }, [showId]);

  return (
    <button
      className="actionBtn"
      type="button"
      onClick={() => {
        toggleFavorite(showId);
        setFav(isFavorite(showId));
      }}
      aria-label={fav ? "Remove favorite" : "Add favorite"}
      title={fav ? "Unfavorite" : "Favorite"}
      style={compact ? { padding: "8px 10px" } : undefined}
    >
      <span>{fav ? "★" : "☆"}</span>
      {!compact ? <span>{fav ? "Favorited" : "Favorite"}</span> : null}
    </button>
  );
};
