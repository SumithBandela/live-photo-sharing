import { Link, useNavigate } from 'react-router-dom';
import './albums.css';

export function Albums() {
  let navigate = useNavigate();
  // Mock album data — replace this with real data from API or database
  const albums = [
    {
      id: 1,
      title: 'Wedding Bells',
      description: 'A beautiful celebration of love and tradition.',
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Birthday Bash',
      description: 'Capturing smiles and birthday wishes.',
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Outdoor Shoot',
      description: 'Nature, light, and perfect moments.',
      thumbnail: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="albums-container">
      <h2>📁 All Albums</h2>
      <div className="album-grid">
        {albums.map((album) => (
          <div className="album-card" key={album.id}>
            <img src={album.thumbnail} alt={album.title} className="album-thumbnail" />
            <h3>{album.title}</h3>
            <p>{album.description}</p>
            <Link to={`/photos/${album.id}`} className="view-btn">📷 View Photos</Link>
          </div>
        ))}
      </div>
      <button className="add-btn mt-4" onClick={()=>navigate('/add-album')}>➕ Add Album</button>
    </div>
  );
}
