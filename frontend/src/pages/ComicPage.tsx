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

  useEffect(() => {
    if (!slug) return;
    
    axios.get("http://localhost:4000/upload/list")
      .then(res => {
        const match = res.data.comics?.find((c: Comic) => c.slug === slug);
        setComic(match || null);
        setLoading(false);
      })
      .catch(() => {
        setComic(null);
        setLoading(false);
      });
  }, [slug]);

  if (!slug) return <div className="panel"><p>Missing comic slug.</p></div>;

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
        {loading ? (
          <p>Loading pages…</p>
        ) : comic ? (
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
        ) : (
          <p>Comic not found.</p>
        )}
      </div>
    </div>
  );
}
