import './gallery.css';

export function Gallery() {
  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>📸 Photo Gallery</h1>
        <p>Browse and enjoy the captured moments!</p>
      </div>

      <div className="gallery-grid">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="gallery-card">
            <img
              src={`https://source.unsplash.com/random/400x400?sig=${i}`}
              alt={`Gallery ${i + 1}`}
              className="gallery-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
