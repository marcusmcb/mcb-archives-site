"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

type Props = {
  initialQuery?: string;
  genre?: string;
  decade?: string;
  station?: string;
  showSortControls?: boolean;
  sortBy?: "station" | "original_broadcast" | "title";
  sortDir?: "asc" | "desc";
  rightSlot?: React.ReactNode;
};

export const SearchBar = ({
  initialQuery = "",
  genre = "",
  decade = "",
  station = "",
  showSortControls = false,
  sortBy,
  sortDir,
  rightSlot
}: Props) => {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [sortValue, setSortValue] = useState(() => {
    const by = sortBy ?? "original_broadcast";
    const dir = sortDir ?? "desc";
    return `${by}:${dir}`;
  });

  const sortParams = useMemo(() => {
    if (!showSortControls) return { sort: "", dir: "" };
    const [by, dir] = sortValue.split(":");
    if (by !== "station" && by !== "title" && by !== "original_broadcast") return { sort: "", dir: "" };
    if (dir !== "asc" && dir !== "desc") return { sort: "", dir: "" };
    return { sort: by, dir };
  }, [showSortControls, sortValue]);

  const actionUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (genre) params.set("genre", genre);
    if (decade) params.set("decade", decade);
    if (station) params.set("station", station);
    if (sortParams.sort) params.set("sort", sortParams.sort);
    if (sortParams.dir) params.set("dir", sortParams.dir);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }, [q, genre, decade, station, sortParams.sort, sortParams.dir]);

  return (
    <div className="topbar">
      <form
        className="search"
        action={actionUrl}
        method="get"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(actionUrl);
        }}
      >
        <input
          name="q"
          placeholder="Search shows by genre, artist, or song title…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>

        {showSortControls ? (
          <select
            className="searchSort"
            aria-label="Sort shows"
            value={sortValue}
            onChange={(e) => {
              const next = e.target.value;
              setSortValue(next);

              const params = new URLSearchParams();
              if (q.trim()) params.set("q", q.trim());
              if (genre) params.set("genre", genre);
              if (decade) params.set("decade", decade);
              if (station) params.set("station", station);

              const [by, dir] = next.split(":");
              if (by) params.set("sort", by);
              if (dir) params.set("dir", dir);

              const qs = params.toString();
              router.push(qs ? `/?${qs}` : "/");
            }}
          >
            <option value="original_broadcast:desc">Broadcast: newest first</option>
            <option value="original_broadcast:asc">Broadcast: oldest first</option>
            <option value="station:asc">Station: A → Z</option>
            <option value="station:desc">Station: Z → A</option>
            <option value="title:asc">Title: A → Z</option>
            <option value="title:desc">Title: Z → A</option>
          </select>
        ) : null}
      </form>

      {rightSlot ?? null}
    </div>
  );
};
