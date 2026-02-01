import UploadForm from "../components/UploadForm";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <h1>Your Comic Library</h1>
          <p className="lede">
            Upload CBZ files, read them instantly. Simple, private, local.
          </p>
          <div className="hero__actions">
            <a className="btn primary" href="#upload">Upload</a>
            <a className="btn ghost" href="#library">View Library</a>
          </div>
        </div>
      </section>

      <section id="upload" className="panel">
        <div className="panel__header">
          <div>
            <h2>Add Comics</h2>
            <p className="muted">Upload a CBZ file and it will be ready to read.</p>
          </div>
        </div>
        <UploadForm />
      </section>
    </div>
  );
}
