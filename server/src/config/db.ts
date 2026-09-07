import dns from "node:dns";
import { MongoClient, ServerApiVersion, Db } from "mongodb";
import { env } from "./enviroment.js";

// Fix lỗi querySrv ECONNREFUSED khi kết nối MongoDB Atlas trên môi trường Windows / Node.js
dns.setServers(["8.8.8.8", "1.1.1.1"]);

let toeicDatabaseInstance: Db | null = null;
let mongoClientInstance: MongoClient | null = null;

export const CONNECT_DB = async () => {
  const uri = env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined in environment variables (.env)!",
    );
  }

  mongoClientInstance = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  // Kết nối tới MongoDB Server
  await mongoClientInstance.connect();

  // Lấy Database Instance theo DATABASE_NAME
  toeicDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

export const GET_DB = (): Db => {
  if (!toeicDatabaseInstance) {
    throw new Error("Database not connected! Please call CONNECT_DB first.");
  }
  return toeicDatabaseInstance;
};

export const CLOSE_DB = async () => {
  if (mongoClientInstance) {
    await mongoClientInstance.close();
  }
};
