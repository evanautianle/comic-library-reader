import { Router } from "express";
import { prisma } from "../prismaClient";

const router = Router();

// Get all comics for a user
router.get("/", async (req, res) => {
  try {
    const comics = await prisma.comic.findMany({
      include: {
        pages: true,
      },
    });

    res.json({ comics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comics" });
  }
});

// Get a specific comic by ID
router.get("/:id", async (req, res) => {
  try {
    const comic = await prisma.comic.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        pages: true,
      },
    });

    if (!comic) {
      return res.status(404).json({ error: "Comic not found" });
    }

    res.json(comic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comic" });
  }
});

export default router;
