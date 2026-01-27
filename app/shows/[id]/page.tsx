import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "../../../components/FavoriteButton";
import { UpvoteButton } from "../../../components/UpvoteButton";
import { AudioPlayerBar } from "../../../components/player/AudioPlayerBar";
import { ListenNowButton } from "../../../components/player/ListenNowButton";
import { SearchBar } from "../../../components/SearchBar";
import { getShowById } from "../../../lib/shows";

const ShowDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  let show: Awaited<ReturnType<typeof getShowById>> | null = null;
  try {
    show = await getShowById(id);
  } catch {
    show = null;
  }
  if (!show) return notFound();

  return (
    <div>
      <SearchBar rightSlot={<Link className="pill" href="/">Back</Link>} />

      <AudioPlayerBar />

      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <div>
          <h1 style={{ margin: 0 }}>{show.title}</h1>
          <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 12 }}>
            {show.station} • {show.original_broadcast_display ?? show.original_broadcast.toISOString().slice(0, 10)}
          </div>
          <div className="cardMeta" style={{ marginTop: 10 }}>
            {show.genres.map((g) => (
              <span key={g} className="pill">
                {g}
              </span>
            ))}
          </div>

          <div className="actions">
            <FavoriteButton showId={show.id} />
            <UpvoteButton showId={show.id} initialUpvotes={show.upvotes} />
          </div>
        </div>
      </div>

      <div className="detail" style={{ marginTop: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={show.image} alt={show.title} />

        <div>
          <div className="card" style={{ padding: 12 }}>
            <ListenNowButton show={{ id: show.id, title: show.title, audio_file_link: show.audio_file_link, image: show.image }} />
          </div>

          <div style={{ height: 12 }} />

          <div className="tracklist">
            {show.songs.map((t, idx) => (
              <div key={`${idx}-${t.title}-${t.artist}`} className="trackRow">
                <div className="trackIndex">{String(idx + 1).padStart(2, "0")}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{t.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetailPage;
