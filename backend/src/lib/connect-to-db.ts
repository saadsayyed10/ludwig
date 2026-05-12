// backend/src/lib/connect-to-db.ts

import prisma from "../config/prisma.orm";

export const connectToDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.log(`Error connecting to MongoDB `, error.message);
  }
};
