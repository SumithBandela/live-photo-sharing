import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './photos.css';
import axios from 'axios';

export function Photos() {
  const { title } = useParams(); // album title
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const location = useLocation();
  const slug = location?.state?.slug;
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    if (!token) return;

    axios
      .get(`http://localhost:8080/api/photos/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: { title }
      })
      .then((response) => {
        if (response.data.status === 'success') {
          const fetchedPhotos = response.data.photos.map((photo) => ({
            url: photo.img_src,
            visible: photo.is_visible === 1,
            email: photo.email // exact email from backend
          }));
          setPhotos(fetchedPhotos);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, [title, token]);

  const handleAddPhotos = () => {
    navigate(`/addphotos/${title}`);
  };

  const handleVisibilityChange = (index, value) => {
    const updated = [...photos];
    updated[index].visible = value === 'Visible';
    setPhotos(updated);

    const { url } = updated[index];
    const visible = updated[index].visible ? 1 : 0;

    axios
      .post('http://localhost:8080/api/photos/visibility', {
        url,
        visible,
        title
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.status === 'success') {
          console.log('Visibility updated successfully');
        } else {
          console.error('Failed to update visibility:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error updating visibility:', error);
      });
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
                src={`http://localhost:8080/${photo.url}`}
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
      <div className="album-link-box">
        <p className="album-title">{title} Album Link</p>
        <span className="album-url">
          https://sumithbandela.github.io/live-photo-sharing/#/album/{slug}
        </span>
        <p className="album-description">
          👆 This is the URL for the <strong>{title} Album</strong>.  
          Copy this link and paste it on <a href='https://www.rashmiphotography.com/#/qr' className='text-white' target="_blank" rel="noopener noreferrer">www.rashmiphotography.com</a> to generate a QR code.
        </p>
        <p className="album-note">
          You can then download and use the QR code to share the album easily with clients.
        </p>
      </div>
    </div>
  );
}
