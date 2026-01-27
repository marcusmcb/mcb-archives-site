"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

type Props = {
  initialQuery?: string;
  genre?: string;
  decade?: string;
  rightSlot?: React.ReactNode;
};

export const SearchBar = ({ initialQuery = "", genre = "", decade = "", rightSlot }: Props) => {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  const actionUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (genre) params.set("genre", genre);
    if (decade) params.set("decade", decade);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }, [q, genre, decade]);

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
      </form>

      {rightSlot ?? null}
    </div>
  );
};
