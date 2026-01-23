import { MongoClient } from "mongodb";

export type MongoConfig = {
  uri: string;
  dbName: string;
};

export function getMongoConfigFromEnv(): MongoConfig {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) throw new Error("Missing env var MONGODB_URI");
  if (!dbName) throw new Error("Missing env var MONGODB_DB");

  return { uri, dbName };
}

export async function withMongo<T>(config: MongoConfig, fn: (client: MongoClient) => Promise<T>): Promise<T> {
  const client = new MongoClient(config.uri);
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}
