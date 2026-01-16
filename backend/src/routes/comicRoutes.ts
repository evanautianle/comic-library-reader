import { Router, Request, Response } from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import { prisma } from "../prismaClient";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", upload.single("comic"), async (req: Request, res: Response) => {
  try {
    console.log("🗄️  [DATABASE] Uploading comic via database (PostgreSQL + Prisma)");
    const { title, userId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const comic = await prisma.comic.create({
      data: {
        title,
        userId: parseInt(userId),
      },
    });

    const zip = new AdmZip(file.path);
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      if (!entry.isDirectory && /\.(jpg|jpeg|png|webp)$/i.test(entry.entryName)) {
        const pageNumber = parseInt(entry.entryName.match(/\d+/)?.[0] || "0");
        const outPath = path.join("uploads", `${comic.id}_${pageNumber}_${entry.name}`);
        fs.writeFileSync(outPath, entry.getData());

        await prisma.page.create({
          data: {
            comicId: comic.id,
            pageNumber,
            imagePath: outPath,
          },
        });
      }
    }

    res.json({ message: "Comic uploaded", comicId: comic.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
