import React from "react";
import UploadForm from "./components/UploadForm";
import ComicReader from "./components/ComicReader";

function App() {
  return (
    <div className="App">
      <h1>My Comic Reader</h1>

      {/* Upload CBZ form */}
      <UploadForm />

      {/* Example reader */}
      <ComicReader comicId={1} />
    </div>
  );
}

export default App;
