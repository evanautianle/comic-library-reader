import { Router } from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

const router = Router();

const upload = multer({
  dest: "uploads/cbz",
  fileFilter: (_req, file, cb) => {
    cb(null, file.originalname.endsWith(".cbz"));
  },
});

const findImageFiles = (dir: string, basePath: string = ""): string[] => {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
    
    if (entry.isDirectory()) {
      files.push(...findImageFiles(fullPath, relativePath));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(relativePath.replace(/\\/g, "/"));
    }
  }
  
  return files;
};

router.post("/", upload.single("comic"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  
  const slug = req.file.originalname.replace(".cbz", "");
  const extractPath = path.join("uploads/comics", slug);

  fs.mkdirSync(extractPath, { recursive: true });
  new AdmZip(req.file.path).extractAllTo(extractPath, true);
  fs.unlinkSync(req.file.path);

  const pages = findImageFiles(extractPath).sort();
  res.json({ message: "Upload successful", slug, pages });
});

router.get("/list", (_req, res) => {
  const base = path.join("uploads", "comics");
  if (!fs.existsSync(base)) return res.json({ comics: [] });

  const comics = fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => ({
      slug: d.name,
      pages: findImageFiles(path.join(base, d.name)).sort()
    }));

  res.json({ comics });
});

export default router;
