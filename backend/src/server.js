import dotenv from "dotenv";

import { app } from "./app.js";
import { connectDb } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

async function main() {
  await connectDb();

  app.listen(PORT, () => {
    console.log(`[pastebin-lite-backend] listening on :${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exitCode = 1;
});
