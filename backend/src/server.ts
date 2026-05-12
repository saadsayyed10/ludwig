// backend/src/server.ts

import express, { Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { connectToDB } from "./lib/connect-to-db";
import { ENV } from "./config/env.config";

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ health: "OK" });
});

const startServer = async () => {
  try {
    await connectToDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server listening on PORT: ${ENV.PORT}`);
    });
  } catch (error: any) {
    console.log(`Error starting server`, error.message);
  }
};

startServer();
