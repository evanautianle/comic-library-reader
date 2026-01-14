import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [pages, setPages] = useState<string[] | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [comics, setComics] = useState<Array<{ slug: string; pages: string[] }> | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a CBZ file.");
      return;
    }

    const formData = new FormData();
    formData.append("comic", file);

    try {
      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`Upload successful: ${res.data.slug}`);
      setFile(null);
      setSlug(res.data.slug);
      setPages(res.data.pages || null);
      // refresh the comics list
      fetchList();
    } catch (err: any) {
      console.error(err);
      setMessage("Upload failed. See console for details.");
    }
  };

  // Fetch list of extracted comics so uploads persist across refresh
  const fetchList = async () => {
    try {
      const res = await axios.get("http://localhost:4000/upload/list");
      setComics(res.data.comics || []);
    } catch (err) {
      console.warn("Failed to fetch uploaded comics list", err);
      setComics([]);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Upload a CBZ Comic</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".cbz" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: "1rem" }}>Upload</button>
      </form>
      {message && <p>{message}</p>}

      {comics && comics.length > 0 && (
        <div style={{ maxWidth: 900, margin: "1rem auto" }}>
          <h3>Available uploads</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {comics.map(c => (
              <div key={c.slug} style={{ width: 200, cursor: "pointer" }} onClick={() => { setSlug(c.slug); setPages(c.pages); }}>
                <div style={{ height: 120, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {c.pages && c.pages.length > 0 ? (
                    <img src={`http://localhost:4000/static/comics/${c.slug}/${c.pages[0]}`} alt={c.slug} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                  ) : (
                    <span style={{ color: "#666" }}>No preview</span>
                  )}
                </div>
                <div style={{ padding: "0.5rem 0" }}>
                  <strong>{c.slug}</strong>
                  <div style={{ fontSize: 12, color: "#666" }}>{c.pages.length} pages</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pages && slug && (
        <div style={{ maxWidth: 900, margin: "1rem auto" }}>
          <h3>Uploaded pages — {slug}</h3>
          {pages.map(p => (
            <img
              key={p}
              src={`http://localhost:4000/static/comics/${slug}/${p}`}
              alt={p}
              style={{ width: "100%", display: "block", marginBottom: "1rem" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
