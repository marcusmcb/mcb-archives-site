import Link from "next/link";

import { FavoriteButton } from "./FavoriteButton";
import { ListenNowButton } from "./player/ListenNowButton";

export type ShowCardModel = {
  id: string;
  title: string;
  image: string;
  audio_file_link: string;
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

        <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
          <ListenNowButton show={{ id: show.id, title: show.title, audio_file_link: show.audio_file_link, image: show.image }} compact />
          <Link className="pill" href={`/shows/${encodeURIComponent(show.id)}`}>
            Details
          </Link>
        </div>

        <div className="cardMeta" style={{ marginTop: 10 }}>
          {show.genres.slice(0, 3).map((g) => (
            <span key={g} className="pill">
              {g}
            </span>
          ))}
          <span className="pill" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M6.5 10.5 12 5l5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>{show.upvotes}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
