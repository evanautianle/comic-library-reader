import { Router } from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

const router = Router();

const upload = multer({
  dest: "uploads/cbz",
  fileFilter: (_req, file, cb) => {
    if (file.originalname.endsWith(".cbz")) cb(null, true);
    else cb(new Error("Only CBZ files allowed"));
  },
});

router.post("/", upload.single("comic"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const slug = req.file.originalname.replace(".cbz", "");
  const extractPath = path.join("uploads/comics", slug);

  fs.mkdirSync(extractPath, { recursive: true });

  const zip = new AdmZip(req.file.path);
  zip.extractAllTo(extractPath, true);

  // Cleanup uploaded ZIP
  fs.unlinkSync(req.file.path);

  // List pages
  const pages = fs.readdirSync(extractPath)
    .filter(f => /\.(jpe?g|png)$/i.test(f))
    .sort();

  res.json({
    message: "Upload successful",
    slug,
    pages,
  });
});

export default router;
