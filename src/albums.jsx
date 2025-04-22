import { Link, useNavigate } from 'react-router-dom';
import './albums.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export function Albums() {
  const [cookies] = useCookies(['adminUser']);
  let navigate = useNavigate();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // Fetch the albums using the username from cookies
    axios
      .get(`https://rashmiphotography.com/backend/add-album.php?username=${cookies.adminUser.toLowerCase()}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setAlbums(response.data.albums); // Update the state with the albums data
        } else {
          console.error('Failed to fetch albums:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching albums:', error);
      });
  }, [cookies.adminUser]); // Re-run the effect when adminUser changes

  return (
    <div className="albums-container">
      <h2>📁 All Albums</h2>
      <div className="album-grid">
        {albums.length > 0 ? (
          albums.map((album) => (
            <div className="album-card" key={album.id}>
              <img
                src={`https://rashmiphotography.com/backend/${album.thumbnail}`} // Assuming your thumbnail paths are relative to the site root
                alt={album.title}
                className="album-thumbnail"
              />
              <h3>{album.title}</h3>
              <p>{album.description}</p>
              <Link to={`/photos/${album.title}`} className="view-btn">📷 View Photos</Link>
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
