import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import uploadRoutes from "./routes/uploadRoutes";

const uploadsDir = path.join(__dirname, "..", "uploads", "comics");
const cbzDir = path.join(__dirname, "..", "uploads", "cbz");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(cbzDir)) {
  fs.mkdirSync(cbzDir, { recursive: true });
}

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/static",
  express.static(path.join(__dirname, "..", "uploads"))
);

app.use("/upload", uploadRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
