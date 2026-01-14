import React, { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [pages, setPages] = useState<string[] | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error(err);
      setMessage("Upload failed. See console for details.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Upload a CBZ Comic</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".cbz" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: "1rem" }}>Upload</button>
      </form>
      {message && <p>{message}</p>}
      {pages && slug && (
        <div style={{ maxWidth: 900, margin: "1rem auto" }}>
          <h3>Uploaded pages</h3>
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
