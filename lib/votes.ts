import type { Collection } from "mongodb";

import { getMongoClient, getMongoEnv } from "./mongo";
import type { ShowDb } from "./shows";

type ReactionDoc = {
  showId: string;
  deviceId: string;
  type: "upvote";
  createdAt: Date;
};

const reactionsCollection = async (): Promise<Collection<ReactionDoc>> => {
  const client = await getMongoClient();
  const { dbName } = getMongoEnv();
  return client.db(dbName).collection<ReactionDoc>("show_reactions");
};

const showsCollection = async (): Promise<Collection<ShowDb>> => {
  const client = await getMongoClient();
  const { dbName } = getMongoEnv();
  return client.db(dbName).collection<ShowDb>("shows");
};

export const getUpvotesForShow = async (showId: string): Promise<number> => {
  const shows = await showsCollection();
  const doc = await shows.findOne({ id: showId }, { projection: { upvotes: 1 } });
  return typeof doc?.upvotes === "number" ? doc.upvotes : 0;
};

export const upvoteShowOnce = async ({
  showId,
  deviceId
}: {
  showId: string;
  deviceId: string;
}): Promise<{ showId: string; upvotes: number; status: "ok" | "duplicate" }> => {
  const reactions = await reactionsCollection();
  const shows = await showsCollection();

  try {
    await reactions.insertOne({ showId, deviceId, type: "upvote", createdAt: new Date() });
    await shows.updateOne({ id: showId }, { $inc: { upvotes: 1 } });
    const upvotes = await getUpvotesForShow(showId);
    return { showId, upvotes, status: "ok" };
  } catch (err: any) {
    if (err?.code === 11000) {
      const upvotes = await getUpvotesForShow(showId);
      return { showId, upvotes, status: "duplicate" };
    }
    throw err;
  }
};
