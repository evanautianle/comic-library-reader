import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

type Comic = {
  slug: string;
  pages: string[];
};

export default function ComicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:4000/upload/list");
        const match = (res.data.comics as Comic[] | undefined)?.find(c => c.slug === slug);
        if (!match) {
          setError("Comic not found or has no pages.");
          setComic(null);
        } else {
          setComic(match);
        }
      } catch (err) {
        console.error("Failed to load comic", err);
        setError("Failed to load comic.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (!slug) {
    return (
      <div className="panel">
        <p>Missing comic slug.</p>
      </div>
    );
  }

  return (
    <div className="comic-page">
      <header className="comic-page__header">
        <div>
          <p className="eyebrow">Reader</p>
          <h1>{slug}</h1>
          <p className="muted">Rendering pages directly from your local static uploads.</p>
        </div>
        <div className="comic-page__actions">
          <Link className="btn ghost" to="/">← Back to library</Link>
        </div>
      </header>

      <div className="panel">
        {loading && <p>Loading pages…</p>}
        {!loading && error && <p className="error">{error}</p>}
        {!loading && !error && comic && (
          <div className="page-grid">
            {comic.pages.map(page => (
              <img
                key={page}
                src={`http://localhost:4000/static/comics/${slug}/${page}`}
                alt={page}
                className="page-image"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
