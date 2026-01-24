import { notFound } from "next/navigation";

import { FavoriteButton } from "../../../components/FavoriteButton";
import { UpvoteButton } from "../../../components/UpvoteButton";
import { getShowById } from "../../../lib/shows";

export default async function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Listen</div>
            <audio controls preload="metadata" style={{ width: "100%" }} src={show.audio_file_link} />
            <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 8 }}>
              If seeking doesn’t work smoothly, confirm your audio host supports HTTP range requests.
            </div>
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
}
