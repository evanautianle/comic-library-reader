import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import comicRoutes from "./routes/comicRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Base route
app.get("/", (_, res) => {
  res.send("Backend is running!");
});

// Comic routes
app.use("/comics", comicRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
