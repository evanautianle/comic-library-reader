import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import comicRoutes from "./routes/comicRoutes";
import pageRoutes from "./routes/pageRoutes";
import uploadRoutes from "./routes/uploadRoutes";

const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Warning: Could not load .env file from ${envPath}:`, result.error.message);
} else if (result.parsed) {
  console.log(`Loaded ${Object.keys(result.parsed).length} environment variables from ${envPath}`);
}

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/static",
  express.static(path.join(__dirname, "..", "uploads"))
);

app.use("/upload", uploadRoutes);
app.use("/comics", comicRoutes);
app.use("/pages", pageRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_, res) => {
  try {
    const { prisma } = await import("./prismaClient");
    await prisma.$queryRaw`SELECT 1`;
    const userCount = await prisma.user.count();
    const comicCount = await prisma.comic.count();
    const pageCount = await prisma.page.count();
    
    res.json({
      status: "connected",
      database: "PostgreSQL",
      tables: {
        users: userCount,
        comics: comicCount,
        pages: pageCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

app.get("/", (_, res) => {
  res.send("Backend is running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
