"use client";

import { useMemo, useState } from "react";

import { getOrCreateDeviceId } from "../lib/device";

export const UpvoteButton = ({ showId, initialUpvotes }: { showId: string; initialUpvotes: number }) => {
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
      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M6.5 10.5 12 5l5.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{pending ? "…" : upvotes}</span>
    </button>
  );
};
