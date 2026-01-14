import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Comic = {
  slug: string;
  pages: string[];
};

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [comics, setComics] = useState<Comic[]>([]);
  const navigate = useNavigate();

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
    setUploading(true);

    try {
      const res = await axios.post("http://localhost:4000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(`Upload successful: ${res.data.slug}`);
      setFile(null);
      await fetchList();
    } catch (err: any) {
      console.error(err);
      setMessage("Upload failed. See console for details.");
    } finally {
      setUploading(false);
    }
  };

  // Fetch list of extracted comics so uploads persist across refresh
  const fetchList = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/upload/list");
      setComics(res.data.comics || []);
    } catch (err) {
      console.warn("Failed to fetch uploaded comics list", err);
      setComics([]);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="upload-form">
      <form className="upload-card" onSubmit={handleSubmit}>
        <div>
          <label className="input-label" htmlFor="comic-file">Select a CBZ file</label>
          <input id="comic-file" type="file" accept=".cbz" onChange={handleFileChange} />
          <p className="muted small">Max size depends on your server limits. CBZ only.</p>
        </div>
        <button className="btn primary" type="submit" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
      {message && <p className="status">{message}</p>}

      <div id="library" className="library">
        <div className="library__header">
          <div>
            <p className="eyebrow">Library</p>
            <h3>Your uploads</h3>
            <p className="muted">Click a cover to open it in the reader page.</p>
          </div>
          <button className="btn ghost" onClick={fetchList}>Refresh</button>
        </div>

        {comics.length === 0 && (
          <div className="empty">No comics yet. Upload a CBZ to get started.</div>
        )}

        {comics.length > 0 && (
          <div className="library__grid">
            {comics.map(c => (
              <div
                key={c.slug}
                className="comic-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/comic/${c.slug}`)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") navigate(`/comic/${c.slug}`);
                }}
              >
                <div className="comic-card__cover">
                  {c.pages && c.pages.length > 0 ? (
                    <img src={`http://localhost:4000/static/comics/${c.slug}/${c.pages[0]}`} alt={c.slug} />
                  ) : (
                    <span className="muted">No preview</span>
                  )}
                </div>
                <div className="comic-card__body">
                  <strong className="comic-card__title">{c.slug}</strong>
                  <span className="comic-card__meta">{c.pages.length} pages</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
