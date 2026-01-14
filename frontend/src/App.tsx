import React from "react";
import ComicReader from "./components/ComicReader";

function App() {
  return (
    <div className="App">
      <h1>My Comic Reader</h1>
      {/* Example: comicId=1, totalPages=10 */}
      <ComicReader comicId={1} totalPages={10} />
    </div>
  );
}

export default App;
