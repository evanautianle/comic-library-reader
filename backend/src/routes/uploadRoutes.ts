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

  console.log("📁 [STATIC] Uploading comic via static file system (no database)");
  
  const slug = req.file.originalname.replace(".cbz", "");
  const extractPath = path.join("uploads/comics", slug);

  fs.mkdirSync(extractPath, { recursive: true });

  const zip = new AdmZip(req.file.path);
  zip.extractAllTo(extractPath, true);

  fs.unlinkSync(req.file.path);

  // some CBZ files have nested folders, need to search recursively
  const findImageFiles = (dir: string, basePath: string = ""): string[] => {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = basePath ? path.join(basePath, entry.name) : entry.name;
      
      if (entry.isDirectory()) {
        files.push(...findImageFiles(fullPath, relativePath));
      } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
        // convert backslashes to forward slashes for URLs
        files.push(relativePath.replace(/\\/g, "/"));
      }
    }
    
    return files;
  };
  
  const pages = findImageFiles(extractPath).sort();

  res.json({
    message: "Upload successful",
    slug,
    pages,
  });
});

router.get("/list", (_req, res) => {
  console.log("📁 [STATIC] Listing comics from file system (no database)");
  const base = path.join("uploads", "comics");
  if (!fs.existsSync(base)) return res.json({ comics: [] });

  const slugs = fs.readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

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

  const comics = slugs.map(slug => {
    const dir = path.join(base, slug);
    const pages = findImageFiles(dir).sort();
    return { slug, pages };
  });

  res.json({ comics });
});

export default router;
