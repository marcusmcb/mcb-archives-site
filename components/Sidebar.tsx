import Link from "next/link";

type Props = {
  genres: string[];
};

export function Sidebar({ genres }: Props) {
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
            <Link href={`/?genre=${encodeURIComponent(g)}`}>{g}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
