import path from "node:path";

import type { Collection, Db } from "mongodb";

import { getMongoConfigFromEnv, withMongo } from "./lib/mongo.js";
import { findShowYamlFiles, loadShowYaml } from "./lib/load_shows.js";
import { normalizeShow } from "./lib/normalize_show.js";
import type { ShowDoc } from "./lib/types.js";

type Args = {
  dryRun: boolean;
  showsDir: string;
};

function parseArgs(argv: string[]): Args {
  const dryRun = argv.includes("--dry-run");
  const dirArgIndex = argv.findIndex((a) => a === "--shows-dir");
  const showsDir =
    dirArgIndex >= 0 && typeof argv[dirArgIndex + 1] === "string" ? argv[dirArgIndex + 1] : (process.env.SHOWS_DIR ?? "content/shows");

  return { dryRun, showsDir };
}

async function ensureIndexes(db: Db): Promise<void> {
  const shows = db.collection<ShowDoc>("shows");
  await shows.createIndex({ id: 1 }, { unique: true });
  await shows.createIndex({ original_broadcast: -1 });
  await shows.createIndex({ genres: 1 });
  await shows.createIndex({ "songs.artist": 1 });
  await shows.createIndex({ "songs.title": 1 });
  await shows.createIndex({ searchText: "text" });

  // Used later for deduped reactions (e.g. upvotes per device)
  const reactions = db.collection("show_reactions");
  await reactions.createIndex({ showId: 1, createdAt: -1 });
  await reactions.createIndex({ showId: 1, deviceId: 1, type: 1 }, { unique: true });
}

async function upsertShow(shows: Collection<ShowDoc>, doc: Omit<ShowDoc, "createdAt">): Promise<"inserted" | "updated"> {
  const existing = await shows.findOne({ id: doc.id }, { projection: { _id: 1, createdAt: 1, upvotes: 1 } });
  const createdAt = existing?.createdAt ?? doc.updatedAt;
  const upvotes = typeof existing?.upvotes === "number" ? existing.upvotes : doc.upvotes;

  const result = await shows.updateOne(
    { id: doc.id },
    {
      $set: { ...doc, upvotes },
      $setOnInsert: { createdAt },
    },
    { upsert: true }
  );

  return result.upsertedCount === 1 ? "inserted" : "updated";
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();

  const showsDir = args.showsDir.replace(/\\/g, "/");
  const showFiles = await findShowYamlFiles(showsDir);

  if (showFiles.length === 0) {
    console.error(`No YAML files found under: ${showsDir}`);
    process.exitCode = 1;
    return;
  }

  const config = getMongoConfigFromEnv();

  await withMongo(config, async (client) => {
    const db = client.db(config.dbName);

    if (!args.dryRun) {
      await ensureIndexes(db);
    }

    const shows = db.collection<ShowDoc>("shows");

    let inserted = 0;
    let updated = 0;

    for (const file of showFiles) {
      const absolute = path.resolve(file);
      const y = await loadShowYaml(absolute);
      const normalized = normalizeShow(y, file, now);

      if (args.dryRun) {
        console.log(`[dry-run] would upsert show: ${normalized.id} (${file})`);
        continue;
      }

      const action = await upsertShow(shows, normalized);
      if (action === "inserted") inserted += 1;
      else updated += 1;

      console.log(`[${action}] ${normalized.id} (${file})`);
    }

    if (!args.dryRun) {
      console.log(`Done. Inserted: ${inserted}, Updated: ${updated}`);
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
