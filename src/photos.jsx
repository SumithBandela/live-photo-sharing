import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './photos.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export function Photos() {
  const { title } = useParams(); // album title
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [cookies] = useCookies(['adminUser']);
  const location = useLocation();
  const slug = location?.state?.slug;

  const username = cookies.adminUser.toLowerCase(); 

  useEffect(() => {
    axios
      .get(`https://rashmiphotography.com/backend/get-photos.php`, {
        params: { username, album: title }
      })
      .then((response) => {
        if (response.data.status === 'success') {
          const fetchedPhotos = response.data.images.map((photo) => ({
            url: photo.img_src,
            visible: photo.is_visible === 1 // Set visibility based on DB value (1 for visible, 0 for hidden)
          }));
          setPhotos(fetchedPhotos);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, [title, username]);

  const handleAddPhotos = () => {
    navigate(`/addphotos/${title}`);
  };

  const handleVisibilityChange = (index, value) => {
    const updated = [...photos];
    updated[index].visible = value === 'Visible';
    setPhotos(updated);

    // Send request to backend to update the visibility in the database
    const url = updated[index].url;
    const visible = updated[index].visible ? 1 : 0;

    axios
      .post('https://rashmiphotography.com/backend/update-photo-visibility.php', {
        url: url,
        visible: visible
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
      <div className="album-link-box">
        <p className="album-title">{title} Album Link</p>
        <span className="album-url">
          https://sumithbandela.github.io/live-photo-sharing/#/album/{slug}
        </span>
        <p className="album-description">
          👉 This is the URL for the <strong>{title} Album</strong>.  
          Copy this link and paste it on <a href='https://www.rashmiphotography.com/#/qr' className='text-white' target="_blank" rel="noopener noreferrer">www.rashmiphotography.com</a> to generate a QR code.
        </p>
        <p className="album-note">
          You can then download and use the QR code to share the album easily with clients.
        </p>
      </div>
    </div>
  );
}
