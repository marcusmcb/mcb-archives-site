import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mcbMongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoEnv() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) throw new Error("Missing env var MONGODB_URI (set it in .env.local)");
  if (!dbName) throw new Error("Missing env var MONGODB_DB (set it in .env.local)");

  return { uri, dbName };
}

export async function getMongoClient(): Promise<MongoClient> {
  const { uri } = getMongoEnv();

  if (!global.__mcbMongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mcbMongoClientPromise = client.connect();
  }

  return global.__mcbMongoClientPromise;
}
