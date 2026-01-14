import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { prisma } from "../generated/prisma";

const router = Router();

// GET /pages/:comicId/:pageNumber
router.get("/:comicId/:pageNumber", async (req: Request, res: Response) => {
  try {
    const comicId = parseInt(req.params.comicId);
    const pageNumber = parseInt(req.params.pageNumber);

    // Find page in DB
    const page = await prisma.page.findFirst({
      where: { comicId, pageNumber },
    });

    if (!page) return res.status(404).json({ error: "Page not found" });

    const filePath = path.resolve(page.imagePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Image file missing" });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to serve page" });
  }
});
// GET /pages/:comicId
router.get("/:comicId", async (req: Request, res: Response) => {
  try {
    const comicId = parseInt(req.params.comicId);

    const pages = await prisma.page.findMany({
      where: { comicId },
      orderBy: { pageNumber: "asc" },
      select: {
        pageNumber: true,
      },
    });

    res.json({
      pages: pages.map(p => ({
        pageNumber: p.pageNumber,
        url: `/pages/${comicId}/${p.pageNumber}`,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

export default router;
