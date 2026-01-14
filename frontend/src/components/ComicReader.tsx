import { useState } from "react";

interface ComicReaderProps {
  comicId: number;
  totalPages: number;
}

export default function ComicReader({ comicId, totalPages }: ComicReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Page {currentPage}</h2>
      <img
        src={`http://localhost:4000/pages/${comicId}/${currentPage}`}
        alt={`Page ${currentPage}`}
        style={{ maxWidth: "90%", maxHeight: "80vh" }}
      />
      <div style={{ marginTop: "20px" }}>
        <button onClick={prevPage} disabled={currentPage === 1}>Prev</button>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}
