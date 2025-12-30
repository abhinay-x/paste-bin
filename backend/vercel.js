import { app } from "./src/app.js";

export const config = { runtime: "nodejs" };

export default function handler(req, res) {
  return app(req, res);
}
