import express, { type Request, type Response } from "express";
import cors from "cors";
import exitHook from "async-exit-hook";
import { CLOSE_DB, CONNECT_DB } from "./config/db.js";
import { env } from "./config/enviroment.js";
import { apiV1 } from "./routes/v1/index.js";

const START_SERVER = () => {
  const app = express();

  app.use(cors({ origin: env.CLIENT_URL }));
  app.use(express.json());

  // API Routes
  app.use("/api/v1", apiV1);

  // Route mặc định kiểm tra server
  app.get("/", async (req: Request, res: Response) => {
    res.json({ message: "TOEIC System Backend API is running!" });
  });

  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`);
  });
};
(async () => {
  try {
    await CONNECT_DB();
    console.log("Connected to MongoDB Cloud Atlas!");
    START_SERVER();
    exitHook((callback) => {
      console.log("Disconnecting from MongoDB Cloud Atlas...");
      CLOSE_DB()
        .then(() => {
          console.log("MongoDB Cloud Atlas disconnected!");
        })
        .finally(() => {
          callback();
        });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
