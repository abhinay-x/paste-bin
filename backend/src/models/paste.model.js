import mongoose from "mongoose";

const PasteSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
    expiresAt: { type: Date, default: null },
    maxViews: { type: Number, default: null },
    viewCount: { type: Number, required: true, default: 0 }
  },
  {
    versionKey: false
  }
);

PasteSchema.index({ expiresAt: 1 });

export const Paste = mongoose.model("Paste", PasteSchema);
