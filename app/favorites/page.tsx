"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { ShowCard, type ShowCardModel } from "../../components/ShowCard";
import { getFavoriteIds, subscribeFavorites } from "../../lib/favorites";

const FavoritesPage = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [shows, setShows] = useState<ShowCardModel[]>([]);
  const [loading, setLoading] = useState(true);

  const idsKey = useMemo(() => favoriteIds.slice().sort().join(","), [favoriteIds]);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
    return subscribeFavorites(() => setFavoriteIds(getFavoriteIds()));
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        if (favoriteIds.length === 0) {
          setShows([]);
          return;
        }

        const params = new URLSearchParams();
        for (const id of favoriteIds) params.append("id", id);

        const res = await fetch(`/api/shows/by-ids?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { shows: ShowCardModel[] };
        setShows(data.shows);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [idsKey, favoriteIds]);

  return (
    <div>
      <div className="topbar">
        <div>
          <h1 style={{ margin: 0 }}>Favorites</h1>
        </div>
        <Link className="pill" href="/">
          Back to all shows
        </Link>
      </div>

      {loading ? <div style={{ color: "var(--muted)" }}>Loading…</div> : null}

      {!loading && favoriteIds.length === 0 ? (
        <div style={{ color: "var(--muted)" }}>No favorites yet. Star some shows on the home page.</div>
      ) : null}

      <div className="grid" style={{ marginTop: 14 }}>
        {shows.map((s) => (
          <ShowCard key={s.id} show={s} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
