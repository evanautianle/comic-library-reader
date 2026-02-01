import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import uploadRoutes from "./routes/uploadRoutes";

const uploadsPath = path.join(__dirname, "..", "uploads");
fs.mkdirSync(path.join(uploadsPath, "comics"), { recursive: true });
fs.mkdirSync(path.join(uploadsPath, "cbz"), { recursive: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use("/static", express.static(uploadsPath));
app.use("/upload", uploadRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
