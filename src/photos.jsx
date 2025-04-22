import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './photos.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export function Photos() {
  const { title } = useParams(); // album title
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const[cookies] = useCookies(['adminUser']);
  // hardcoded for now, replace with session or state value later
  const username = cookies.adminUser.toLowerCase(); 

  useEffect(() => {
    axios
      .get(`https://rashmiphotography.com/backend/get-photos.php`, {
        params: { username, album: title }
      })
      .then((response) => {
        if (response.data.status === 'success') {
          const fetchedPhotos = response.data.images.map((imgSrc) => ({
            url: imgSrc,
            visible: true // default visibility; can be updated if you manage visibility from backend
          }));
          setPhotos(fetchedPhotos);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, [title,username]);

  const handleAddPhotos = () => {
    navigate(`/addphotos/${title}`);
  };

  const handleVisibilityChange = (index, value) => {
    const updated = [...photos];
    updated[index].visible = value === 'Visible';
    setPhotos(updated);
  };

  return (
    <div className="photos-container">
      <div className="photos-header">
        <h2>📷 Photos in Album #{title}</h2>
        <button className="add-btn" onClick={handleAddPhotos}>➕ Add Photos</button>
      </div>

      {photos.length === 0 ? (
        <p>No photos found for this album.</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <div key={index} className="photo-card">
              <img
                src={`https://rashmiphotography.com/backend/${photo.url}`}
                alt="img"
                className={`photo-img ${photo.visible ? '' : 'hidden-photo'}`}
              />
              <select
                value={photo.visible ? 'Visible' : 'Hidden'}
                onChange={(e) => handleVisibilityChange(index, e.target.value)}
                className="visibility-select"
              >
                <option value="Visible">Visible</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
