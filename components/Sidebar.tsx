import Link from "next/link";

type Props = {
  genres: string[];
};

export const Sidebar = ({ genres }: Props) => {
  return (
    <div>
      <nav className="nav">
        <Link href="/">Home</Link>
        <Link href="/favorites">Favorites</Link>
      </nav>

      <div className="genresHeader">Genres</div>
      <ul className="genreList">
        {genres.length === 0 ? (
          <li style={{ color: "var(--muted)", fontSize: 12, padding: "0 10px" }}>
            No genres yet (seed your DB)
          </li>
        ) : null}
        {genres.map((g) => (
          <li key={g}>
            <Link href={`/?genre=${encodeURIComponent(g)}`}>
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
        ))}
      </ul>
    </div>
  );
};
