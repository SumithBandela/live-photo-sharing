import { useNavigate } from 'react-router-dom';
import './albums.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserInfo } from './utils/auth';

export function Albums() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.email) {
      navigate('/login');
      return;
    }

    const email = userInfo.email;

    axios
      .get(`http://localhost:8080/api/albums?email=${email}`)
      .then((response) => {
        if (response.data.success) {
          setAlbums(response.data.albums);
        } else {
          console.error('Failed to fetch albums:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching albums:', error);
      });
  }, [navigate]);

  function handleViewClick(title, slug) {
    navigate(`/photos/${title}`, { state: { slug: slug } });
  }

  function handleEditClick(id) {
    navigate(`/edit-album/${id}`);
  }

  return (
    <div className="albums-container">
      <h2>📁 All Albums</h2>
      <div className="album-grid">
        {albums.length > 0 ? (
          albums.map((album) => (
            <div className="album-card" key={album.id}>
              <img
                src={`http://localhost:8080/${album.thumbnail}?ts=${Date.now()}`}
                alt={album.title}
                className={`album-thumbnail ${album.is_visible ? '' : 'hidden-album'}`}
              />
              <h3>{album.title}</h3>
              <p>{album.description}</p>
              <span onClick={() => handleViewClick(album.title, album.slug)} className="view-btn">📷 View Photos</span>
              <span onClick={() => handleEditClick(album.id)} className="edit-btn">✏️ Edit</span>
            </div>
          ))
        ) : (
          <p>No albums found.</p>
        )}
      </div>
      <button className="add-btn mt-4" onClick={() => navigate('/add-album')}>
        ➕ Add Album
      </button>
    </div>
  );
}
