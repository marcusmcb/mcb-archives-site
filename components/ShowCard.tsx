import Link from "next/link";

import { FavoriteButton } from "./FavoriteButton";

export type ShowCardModel = {
  id: string;
  title: string;
  image: string;
  genres: string[];
  original_broadcast: string; // ISO string from API
  original_broadcast_display?: string;
  station: string;
  upvotes: number;
};

export const ShowCard = ({ show }: { show: ShowCardModel }) => {
  const dateText = show.original_broadcast_display ?? show.original_broadcast.slice(0, 10);

  return (
    <div className="card">
      <Link href={`/shows/${encodeURIComponent(show.id)}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={show.image} alt={show.title} style={{ width: "100%", display: "block", aspectRatio: "1 / 1", objectFit: "cover" }} />
      </Link>

      <div className="cardBody">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
          <div style={{ minWidth: 0 }}>
            <h3 className="cardTitle" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={show.title}>
              {show.title}
            </h3>
            <div className="cardMeta">
              <span className="pill">{dateText}</span>
              <span className="pill">{show.station}</span>
            </div>
          </div>

          <FavoriteButton showId={show.id} compact />
        </div>

        <div className="cardMeta" style={{ marginTop: 10 }}>
          {show.genres.slice(0, 3).map((g) => (
            <span key={g} className="pill">
              {g}
            </span>
          ))}
          <span className="pill">👍 {show.upvotes}</span>
        </div>
      </div>
    </div>
  );
};
