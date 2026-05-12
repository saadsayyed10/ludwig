// backend/src/config/env.config.ts

import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5000,
};
