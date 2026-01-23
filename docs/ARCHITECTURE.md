# MCB Archives - Architecture & Implementation Plan

## Goals

- Fast browsing of shows with filters (genres) + full-text-ish search (genre, artist, song title)
- Mobile-friendly layout similar to djedits.net (left nav on desktop, hamburger on mobile)
- Show detail page with a reliable audio player (scrubbing/seek)
- No logins/accounts for now
- Favorites saved locally in the browser
- Upvotes persisted globally (server-side)

## Recommended stack (simple + scalable)

### Frontend

- **Next.js (TypeScript)**
  - SEO-friendly by default (SSG/SSR available)
  - Great routing for show detail pages (`/shows/[id]`)
  - Easy deployment (Vercel) or self-host on Railway

### Backend

Two good options:

1) **Next.js “full-stack”** (recommended to start)
   - Use Next.js Route Handlers (`app/api/...`) for the small API needs (search, upvotes)
   - Keeps a single repo/service to deploy

2) **NestJS API + Next.js frontend** (nice for later)
   - Cleaner service boundaries if you anticipate growth
   - Slightly more setup overhead early on

## Data & content source

### Authoring format

- Author shows as YAML files under `content/shows/*.yml`.
- At build time (or server start), parse YAML into a normalized `Show` model.

Why YAML works well here:
- You can version control the archive
- Easy to edit and batch-add shows
- Easy to reindex/search

### Canonical Show shape

Minimum fields (matches your outline):

- `id: string`
- `title: string`
- `image: string` (URL)
- `audio_file_link: string` (URL)
- `genres: string[]`
- `original_broadcast: string` (ISO date, e.g. `2012-10-01`)
- `station: string`
- `songs: { title: string; artist: string }[]`

Practical optional fields:
- `original_broadcast_display: string` (for “October, 2012”)
- `duration_seconds: number` (good for UI)

## Search strategy

You have two viable approaches depending on size.

### Option A: Static search index (best for “small/medium” archives)

- Build an in-memory index from YAML at build time.
- Search client-side using a library like `flexsearch` or `minisearch`.
- Pros: no database required for search, very fast, cheapest to host.
- Cons: needs rebuild/deploy to add new shows.

This still allows server-side persisted upvotes (Option B just for votes).

### Option B: MongoDB-backed search API (best as archive grows)

- Store shows in MongoDB (seed from YAML or manage via scripts).
- Create indexes:
  - `genres` as a multikey index for filtering
  - `songs.artist` and `songs.title` indexed
  - Optional: a computed `searchText` field (concatenate title/genres/station/songs) + a Mongo text index

Query patterns:
- Filter by genre: `{ genres: selectedGenre }`
- Search:
  - Text search if using `searchText` + `$text`
  - Or `regex` on `songs.artist`, `songs.title`, `title`, and `station` for smaller datasets

## Upvotes + Favorites

### Favorites

- Store in `localStorage` as an array of `showId`s.
- UI:
  - Sidebar button “Favorites” switches the main list to only those IDs.

### Upvotes

- Store server-side in MongoDB with **dedupe** (no accounts):
  - Collection: `show_reactions`
  - Document: `{ showId: string, deviceId: string, type: "upvote", createdAt: Date }`
  - Unique index: `(showId, deviceId, type)` prevents duplicates per device
  - Optional counter cache: keep `shows.upvotes` and `$inc` only when inserting a new reaction

API shape (REST):

- `GET /api/shows?genre=&q=&limit=&cursor=`
- `GET /api/shows/:id`
- `GET /api/shows/:id/votes`
- `POST /api/shows/:id/votes` (insert reaction; increment only if new)

Note: without user accounts, upvotes can still be spammed. Lightweight mitigations:
- Rate-limit by IP
- Store a device ID in a cookie/localStorage and enforce the unique reaction index

## Audio player

Baseline recommendation:
- Start with native HTML5 `<audio>`; it’s reliable and supports seeking.
- Build custom controls around it (play/pause, scrub bar, time).

If you want nicer UX later:
- Add `wavesurfer.js` for waveform + scrubbing.

Critical requirement for smooth seeking:
- Your audio host must support **HTTP Range requests**.

## Audio/image storage (cost-conscious)

Good options:

- **Cloudflare R2 + Cloudflare CDN**
  - Very cost-effective for egress vs many providers
  - Works great for static assets

- **Backblaze B2 + Cloudflare**
  - Common low-cost combo

- **AWS S3 + CloudFront**
  - Most standard, sometimes pricier at scale

Keep assets public to avoid auth complexity, unless you later need private links.

## UI layout notes (matching your outline)

- Desktop:
  - Left sidebar (Home, Favorites, Genres)
  - Main area: Search input pinned at top, then a responsive card grid

- Mobile:
  - Top bar with hamburger to open Genres + Favorites
  - Search stays visible above results

## Next suggested implementation sequence

1) Implement Next.js app shell + routes (`/` and `/shows/[id]`)
2) Parse YAML from `content/shows` and render cards + detail pages
3) Add favorites (localStorage)
4) Add search (static index) + genre filters
5) Add upvotes API + persistence
6) Add pagination/infinite scroll
