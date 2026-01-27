"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  genres: string[];
  decades: string[];
  stations: string[];
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

export const Sidebar = ({ genres, decades, stations }: Props) => {
  const sp = useSearchParams();

  // Filters always target the home page list.
  const filterPath = "/";

  const activeGenre = (sp.get("genre") ?? "").trim().toLowerCase();
  const activeDecade = (sp.get("decade") ?? "").trim().toLowerCase();
  const activeStation = (sp.get("station") ?? "").trim();

  const [genresOpen, setGenresOpen] = useState(true);
  const [decadesOpen, setDecadesOpen] = useState(false);
  const [stationsOpen, setStationsOpen] = useState(false);

  useEffect(() => {
    try {
      const g = window.localStorage.getItem("mcb.sidebar.genresOpen");
      const d = window.localStorage.getItem("mcb.sidebar.decadesOpen");
      const s = window.localStorage.getItem("mcb.sidebar.stationsOpen");
      if (g === "0") setGenresOpen(false);
      if (g === "1") setGenresOpen(true);

      if (d === "0") setDecadesOpen(false);
      if (d === "1") setDecadesOpen(true);

      if (s === "0") setStationsOpen(false);
      if (s === "1") setStationsOpen(true);
    } catch {
      // ignore
    }
  }, []);

  const toggleGenres = () => {
    setGenresOpen((v) => {
      const next = !v;
      try {
        window.localStorage.setItem("mcb.sidebar.genresOpen", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleDecades = () => {
    setDecadesOpen((v) => {
      const next = !v;
      try {
        window.localStorage.setItem("mcb.sidebar.decadesOpen", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleStations = () => {
    setStationsOpen((v) => {
      const next = !v;
      try {
        window.localStorage.setItem("mcb.sidebar.stationsOpen", next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/favorites">Favorites</Link>
      </nav>

      <div className="filtersScroll">
        <div className="sectionHeader">
          <div className="genresHeader" style={{ margin: 0 }}>
            Genres
          </div>
          <button
            type="button"
            className="sectionToggle"
            onClick={toggleGenres}
            aria-label={genresOpen ? "Collapse genres" : "Expand genres"}
            aria-expanded={genresOpen}
            aria-controls="sidebar-genres"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              {genresOpen ? (
                <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {genresOpen ? (
          <ul className="genreList" id="sidebar-genres">
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
        ) : null}

        <div className="sectionHeader">
          <div className="genresHeader" style={{ margin: 0 }}>
            Decades
          </div>
          <button
            type="button"
            className="sectionToggle"
            onClick={toggleDecades}
            aria-label={decadesOpen ? "Collapse decades" : "Expand decades"}
            aria-expanded={decadesOpen}
            aria-controls="sidebar-decades"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              {decadesOpen ? (
                <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {decadesOpen ? (
          <ul className="genreList" id="sidebar-decades">
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
        ) : null}

        <div className="sectionHeader">
          <div className="genresHeader" style={{ margin: 0 }}>
            Stations
          </div>
          <button
            type="button"
            className="sectionToggle"
            onClick={toggleStations}
            aria-label={stationsOpen ? "Collapse stations" : "Expand stations"}
            aria-expanded={stationsOpen}
            aria-controls="sidebar-stations"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              {stationsOpen ? (
                <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        {stationsOpen ? (
          <ul className="genreList" id="sidebar-stations">
            {stations.length === 0 ? (
              <li style={{ color: "var(--muted)", fontSize: 12, padding: "0 10px" }}>
                No stations yet (seed your DB)
              </li>
            ) : null}
            {stations.map((s) => {
              const isActive = activeStation === s;
              const href = buildHref(filterPath, sp, { station: isActive ? undefined : s });
              return (
                <li key={s}>
                  <Link href={href} className={isActive ? "isActive" : undefined}>
                    <span className="genreIcon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M12 22s8-4.5 8-12a8 8 0 1 0-16 0c0 7.5 8 12 8 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="10" r="2.2" fill="currentColor" />
                      </svg>
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
};
