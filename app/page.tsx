import Link from "next/link";

import { ShowCard } from "../components/ShowCard";
import { getShows } from "../lib/shows";

const Home = async ({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; genre?: string; page?: string }>;
}) => {
  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const genre = (sp.genre ?? "").trim().toLowerCase();
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const limit = 6;

  let shows: Awaited<ReturnType<typeof getShows>>["shows"] = [];
  let total = 0;
  let mongoError: string | null = null;

  try {
    const result = await getShows({ q, genre, page, limit });
    shows = result.shows;
    total = result.total;
  } catch (err: any) {
    mongoError = err?.message ? String(err.message) : "Unable to load shows from MongoDB.";
  }
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const noResults = !mongoError && total === 0 && (q.length > 0 || genre.length > 0);

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

      {noResults ? (
        <div className="card" style={{ padding: 12, marginBottom: 14 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No results</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>
            Nothing matched{q ? ` “${q}”` : ""}
            {genre ? ` in genre “${genre}”` : ""}. Try a different search or clear your filters.
          </div>
        </div>
      ) : null}

      <div className="grid">
        {shows.map((s) => (
          <ShowCard key={s.id} show={s} />
        ))}
      </div>

      {mongoError ? (
        <div style={{ marginTop: 16, color: "var(--muted)" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No data yet</div>
          <div style={{ marginBottom: 10 }}>{mongoError}</div>
          <div>Fix: set `MONGODB_URI` + `MONGODB_DB` in `.env.local` (or `.env`), then run `npm run seed`.</div>
        </div>
      ) : null}

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
};

export default Home;
