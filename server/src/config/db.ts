import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./enviroment.js";

// Fix lỗi querySrv ECONNREFUSED khi kết nối MongoDB Atlas trên môi trường Windows / Node.js
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const CONNECT_DB = async () => {
  const uri = env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined in environment variables (.env)!",
    );
  }

  await mongoose.connect(uri, {
    ...(env.DATABASE_NAME ? { dbName: env.DATABASE_NAME } : {}),
  });
};

export const CLOSE_DB = async () => {
  await mongoose.disconnect();
};
