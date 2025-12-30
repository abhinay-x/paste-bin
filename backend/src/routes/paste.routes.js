import express from "express";

import {
  createPaste,
  getPasteHtml,
  getPasteJson
} from "../controllers/paste.controller.js";

export const pasteApiRouter = express.Router();
export const pasteHtmlRouter = express.Router();

pasteApiRouter.post("/pastes", createPaste);
pasteApiRouter.get("/pastes/:id", getPasteJson);

pasteHtmlRouter.get("/p/:id", getPasteHtml);
