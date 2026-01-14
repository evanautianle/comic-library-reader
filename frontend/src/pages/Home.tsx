import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Comic Library</p>
          <h1>Upload, organize, and read your comics in seconds.</h1>
          <p className="lede">
            Drop a CBZ, get instant previews, and open the reader in its own page. No extra steps,
            no clutter.
          </p>
          <div className="hero__actions">
            <a className="btn primary" href="#upload">Upload a comic</a>
            <a className="btn ghost" href="#library">Browse library</a>
          </div>
        </div>
        <div className="hero__badge">
          <div className="badge-card">
            <div className="badge-card__title">Fast import</div>
            <div className="badge-card__meta">CBZ · JPG · PNG</div>
            <div className="badge-card__body">
              Extracts pages server-side and serves them statically for quick reading.
            </div>
          </div>
        </div>
      </section>

      <section id="upload" className="panel">
        <div className="panel__header">
          <div>
            <p className="eyebrow">Uploader</p>
            <h2>Drop in a new CBZ</h2>
            <p className="muted">We’ll extract it and make it available in the library instantly.</p>
          </div>
        </div>
        <UploadForm />
      </section>
    </div>
  );
}
