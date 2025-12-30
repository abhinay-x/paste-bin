import express from "express";
import mongoose from "mongoose";

export const healthRouter = express.Router();

healthRouter.get("/healthz", async (req, res) => {
  const dbState = mongoose.connection.readyState;

  if (dbState === 1) {
    try {
      await mongoose.connection.db.admin().ping();
      return res.json({ ok: true });
    } catch (err) {
      return res.status(503).json({ ok: false });
    }
  }

  return res.status(503).json({ ok: false });
});
