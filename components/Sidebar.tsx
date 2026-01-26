"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  genres: string[];
  decades: string[];
};

const buildHref = (pathname: string, sp: URLSearchParams, next: Record<string, string | undefined>) => {
  const params = new URLSearchParams(sp);

  // Any filter change should reset pagination.
  params.delete("page");

  for (const [k, v] of Object.entries(next)) {
    if (v && v.length > 0) params.set(k, v);
    else params.delete(k);
  }

  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
};

export const Sidebar = ({ genres, decades }: Props) => {
  const sp = useSearchParams();

  // Filters always target the home page list.
  const filterPath = "/";

  const activeGenre = (sp.get("genre") ?? "").trim().toLowerCase();
  const activeDecade = (sp.get("decade") ?? "").trim().toLowerCase();

  return (
    <div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/favorites">Favorites</Link>
      </nav>

      <div className="filtersScroll">
        <div className="genresHeader">Genres</div>
        <ul className="genreList">
          {genres.length === 0 ? (
            <li style={{ color: "var(--muted)", fontSize: 12, padding: "0 10px" }}>
              No genres yet (seed your DB)
            </li>
          ) : null}
          {genres.map((g) => {
            const isActive = activeGenre === g;
            const href = buildHref(filterPath, sp, { genre: isActive ? undefined : g });
            return (
              <li key={g}>
                <Link href={href} className={isActive ? "isActive" : undefined}>
                  <span className="genreIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.59 13.41 13.41 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                    </svg>
                  </span>
                  <span>{g}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="genresHeader">Decades</div>
        <ul className="genreList">
          {decades.length === 0 ? (
            <li style={{ color: "var(--muted)", fontSize: 12, padding: "0 10px" }}>
              No decades yet (seed your DB)
            </li>
          ) : null}
          {decades.map((d) => {
            const isActive = activeDecade === d;
            const href = buildHref(filterPath, sp, { decade: isActive ? undefined : d });
            return (
              <li key={d}>
                <Link href={href} className={isActive ? "isActive" : undefined}>
                  <span className="genreIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.59 13.41 13.41 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                    </svg>
                  </span>
                  <span>{d}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
