import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ComicPage from "./pages/ComicPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <Link to="/">Comic Library</Link>
          </div>
          <nav className="nav">
            <a href="#upload">Upload</a>
            <a href="#library">Library</a>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/comic/:slug" element={<ComicPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <span>Built for your personal collection.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
