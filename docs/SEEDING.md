# Seeding MongoDB from YAML

## Why YAML + seed?

- YAML files are your editable “source of truth” for show metadata.
- Seeding imports/updates those YAML files into MongoDB so the site can query fast.

This workflow scales nicely:
- Add/update YAML → run seed → DB stays in sync.

## Prereqs

- Node.js installed
- A MongoDB database (Railway or MongoDB Atlas)

## Setup

1) Install dependencies:

- `npm install`

2) Create a local `.env` from `.env.example`:

- `MONGODB_URI=...`
- `MONGODB_DB=...`

If you’re running the Next.js app locally, prefer `.env.local` (see [.env.local.example](../.env.local.example)).

## Run seed

- Dry run (prints what it would do): `npm run seed:dry`
- Real run (upserts shows, creates indexes): `npm run seed`

### Notes

- Files are read from `content/shows/**/*.yml` by default.
- Shows are **upserted** by `id` (insert if new, update if existing).
- Indexes are created for:
  - `shows.id` unique
  - genre filtering
  - tracklist search fields
  - optional `searchText` text search

## Adding a new show

1) Copy the template:

- Start from [content/shows/example-show.yml](../content/shows/example-show.yml)

2) Create a new YAML file in `content/shows/` (e.g. `content/shows/clubjam-dance-2012-10.yml`)

3) Run `npm run seed`
