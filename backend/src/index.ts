import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import comicRoutes from "./routes/comicRoutes";
import pageRoutes from "./routes/pageRoutes";
import uploadRoutes from "./routes/uploadRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/static",
  express.static(path.join(__dirname, "..", "uploads"))
);

// Routes
app.use("/upload", uploadRoutes);
app.use("/comics", comicRoutes);
app.use("/pages", pageRoutes);

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Base route
app.get("/", (_, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
