import { useEffect, useState } from "react";

type Page = {
  pageNumber: number;
  url: string;
};

type Props = {
  comicId: number;
};

export default function ComicReader({ comicId }: Props) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/pages/${comicId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load pages");
        return res.json();
      })
      .then(data => {
        setPages(data.pages);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not load pages for comicId", comicId, err);
        setPages([]);
        setLoading(false);
      });
  }, [comicId]);

  if (loading) return <p>Loading pages…</p>;


  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {pages.map(page => (
        <img
          key={page.pageNumber}
          src={`http://localhost:4000${page.url}`}
          alt={`Page ${page.pageNumber}`}
          style={{
            width: "100%",
            display: "block",
            marginBottom: "1rem",
          }}
        />
      ))}
    </div>
  );
}
