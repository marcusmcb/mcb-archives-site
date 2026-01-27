import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mcbMongoClientPromise: Promise<MongoClient> | undefined;
}

export const getMongoEnv = () => {
  const stripWrappingQuotes = (v: string) => {
    const s = v.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      return s.slice(1, -1).trim();
    }
    return s;
  };

  const uri = process.env.MONGODB_URI ? stripWrappingQuotes(process.env.MONGODB_URI) : undefined;
  const dbName = process.env.MONGODB_DB ? stripWrappingQuotes(process.env.MONGODB_DB) : undefined;

  const looksLikePlaceholder = (value: string) =>
    value.includes("<user>") || value.includes("<pass>") || value.includes("<cluster>") || value.includes("<db>");

  if (!uri || looksLikePlaceholder(uri)) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI in .env.local (or .env) to a real MongoDB connection string."
    );
  }
  if (!dbName || looksLikePlaceholder(dbName)) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_DB in .env.local (or .env) to your database name (e.g. mcb_archives)."
    );
  }

  return { uri, dbName };
};

export const getMongoClient = async (): Promise<MongoClient> => {
  const { uri } = getMongoEnv();

  if (!global.__mcbMongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mcbMongoClientPromise = client.connect();
  }

  return global.__mcbMongoClientPromise;
};
