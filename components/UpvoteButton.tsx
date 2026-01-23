"use client";

import { useMemo, useState } from "react";

import { getOrCreateDeviceId } from "../lib/device";

export function UpvoteButton({ showId, initialUpvotes }: { showId: string; initialUpvotes: number }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [pending, setPending] = useState(false);
  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  return (
    <button
      className="actionBtn"
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        try {
          const res = await fetch(`/api/shows/${encodeURIComponent(showId)}/votes`, {
            method: "POST",
            headers: {
              "x-device-id": deviceId
            }
          });
          const data = (await res.json()) as { upvotes?: number; error?: string };
          if (typeof data.upvotes === "number") setUpvotes(data.upvotes);
        } finally {
          setPending(false);
        }
      }}
    >
      <span>👍</span>
      <span>{pending ? "…" : upvotes}</span>
    </button>
  );
}
