import cors from "cors";
import express from "express";
import helmet from "helmet";

import { healthRouter } from "./routes/health.routes.js";
import { pasteApiRouter, pasteHtmlRouter } from "./routes/paste.routes.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", healthRouter);
app.use("/api", pasteApiRouter);
app.use("/", pasteHtmlRouter);

app.use((req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal_server_error" });
});
