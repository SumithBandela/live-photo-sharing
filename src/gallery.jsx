import { useEffect, useState } from 'react';
import './gallery.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function Gallery() {
  const [cookies] = useCookies(['adminUser']);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://rashmiphotography.com/backend/add-album.php?username=${cookies.adminUser.toLowerCase()}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setAlbums(response.data.albums);
        } else {
          console.error('Failed to fetch albums:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching albums:', error);
      });
  }, [cookies.adminUser]);

  const handleCardClick = (title) => {
    navigate(`/album/${title}`);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>📸 Photo Gallery</h1>
        <p>Browse and enjoy the captured moments!</p>
      </div>

      <div className="gallery-grid">
        {albums.map((album, i) => (
          <div key={i} className="gallery-card" onClick={() => handleCardClick(album.slug)}>
            <img
              src={`https://rashmiphotography.com/backend/${album.thumbnail}`}
              alt={`Gallery ${i + 1}`}
              className="gallery-img"
            />
            <h3>{album.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
