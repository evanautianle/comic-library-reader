import { Router } from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";

const router = Router();
const IMAGE_REGEX = /\.(jpe?g|png|webp)$/i;

const upload = multer({
  dest: "uploads/cbz",
  fileFilter: (_, file, cb) => cb(null, file.originalname.endsWith(".cbz")),
});

// Recursively find all image files in a directory, handling nested folders
const findImageFiles = (dir: string, basePath: string = ""): string[] => {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
    
    if (entry.isDirectory()) {
      files.push(...findImageFiles(fullPath, relativePath));
    } else if (IMAGE_REGEX.test(entry.name)) {
      files.push(relativePath.replace(/\\/g, "/"));
    }
  }
  
  return files;
};

// POST /upload - Upload and extract a CBZ file
router.post("/", upload.single("comic"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  
  // Remove .cbz extension to use as folder name
  const slug = req.file.originalname.replace(".cbz", "");
  const extractPath = path.join("uploads/comics", slug);

  // Create extraction directory and extract CBZ (ZIP) contents
  fs.mkdirSync(extractPath, { recursive: true });
  fs.mkdirSync(extractPath, { recursive: true });
  new AdmZip(req.file.path).extractAllTo(extractPath, true);
  fs.unlinkSync(req.file.path);
  res.json({ 
    message: "Upload successful", 
    slug, 
    pages: findImageFiles(extractPath).sort() 
  });
});

// GET /list - List all uploaded comics and their pages
router.get("/list", (_req, res) => {
  const base = path.join("uploads", "comics");
  if (!fs.existsSync(base)) return res.json({ comics: [] });

  // Map each comic folder to an object with slug and pages
  res.json({
    comics: fs.readdirSync(base, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => ({
        slug: d.name,
        pages: findImageFiles(path.join(base, d.name)).sort()
      }))
  });
});

export default router;
