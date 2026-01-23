import Link from "next/link";

import { ShowCard } from "../components/ShowCard";
import { getShows } from "../lib/shows";

export default async function Home({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; genre?: string; page?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const genre = (sp.genre ?? "").trim().toLowerCase();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const limit = 6;

  const { shows, total } = await getShows({ q, genre, page, limit });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="topbar">
        <form className="search" action="/" method="get">
          <input
            name="q"
            placeholder="Search shows by genre, artist, or song title…"
            defaultValue={q}
          />
          {genre ? <input type="hidden" name="genre" value={genre} /> : null}
          <button type="submit">Search</button>
        </form>

        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          {total} show{total === 1 ? "" : "s"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        {genre ? (
          <Link className="pill" href={q ? `/?q=${encodeURIComponent(q)}` : "/"}>
            Clear genre: {genre}
          </Link>
        ) : null}
        {q ? (
          <Link className="pill" href={genre ? `/?genre=${encodeURIComponent(genre)}` : "/"}>
            Clear search
          </Link>
        ) : null}
      </div>

      <div className="grid">
        {shows.map((s) => (
          <ShowCard key={s.id} show={s} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          Page {page} / {totalPages}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {page > 1 ? (
            <Link
              className="pill"
              href={`/?${new URLSearchParams({
                ...(q ? { q } : {}),
                ...(genre ? { genre } : {}),
                page: String(page - 1)
              }).toString()}`}
            >
              Prev
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              className="pill"
              href={`/?${new URLSearchParams({
                ...(q ? { q } : {}),
                ...(genre ? { genre } : {}),
                page: String(page + 1)
              }).toString()}`}
            >
              Next
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
