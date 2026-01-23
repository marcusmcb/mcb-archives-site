# MCB Archives Site

An archive website for previously aired mixshow sets from **djmarcusmcb**.

## Content model

Each show lives in a YAML file under [content/shows](content/shows).

- Template: [content/shows/example-show.yml](content/shows/example-show.yml)
- Each file should define a unique `id`, plus `title`, `image`, `audio_file_link`, `genres`, `original_broadcast`, `station`, and a `songs` tracklist.

## Planned features

- Main page with a left sidebar (Home + Favorites + Genres)
- Search by genre, artist, or song title
- Main grid of show “cards” (title, image, genre(s), date)
- Show detail page with tracklist + audio player (seek/pause/play)
- Favorites stored locally in the browser (no login)
- Per-show “thumbs up” upvotes stored server-side

## Architecture notes

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a concrete implementation plan (Next.js + TypeScript + MongoDB/Railway options).

## Seeding MongoDB from YAML

This repo treats YAML files under [content/shows](content/shows) as the authoring source of truth.

- Copy [.env.example](.env.example) to `.env` and set `MONGODB_URI` + `MONGODB_DB`
- Install deps: `npm install`
- Dry run: `npm run seed:dry`
- Seed (upsert + indexes): `npm run seed`

More details: [docs/SEEDING.md](docs/SEEDING.md)
