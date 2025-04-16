import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './photos.css';

export function Photos() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  // Mock photo data with visibility flag
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const mockData = {
      1: [
        { url: 'https://via.placeholder.com/300x200?text=Wedding+1', visible: true },
        { url: 'https://via.placeholder.com/300x200?text=Wedding+2', visible: true },
      ],
      2: [
        { url: 'https://via.placeholder.com/300x200?text=Birthday+1', visible: true },
        { url: 'https://via.placeholder.com/300x200?text=Birthday+2', visible: true },
      ],
      3: [
        { url: 'https://via.placeholder.com/300x200?text=Outdoor+1', visible: true },
        { url: 'https://via.placeholder.com/300x200?text=Outdoor+2', visible: true },
      ],
    };
    setPhotos(mockData[albumId] || []);
  }, [albumId]);

  const handleAddPhotos = () => {
    navigate(`/addphotos/${albumId}`);
  };

  const handleVisibilityChange = (index, value) => {
    const updated = [...photos];
    updated[index].visible = value === 'Visible';
    setPhotos(updated);
  };

  return (
    <div className="photos-container">
      <div className="photos-header">
        <h2>📷 Photos in Album #{albumId}</h2>
        <button className="add-btn" onClick={handleAddPhotos}>➕ Add Photos</button>
      </div>

      {photos.length === 0 ? (
        <p>No photos found for this album.</p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo, index) => (
            <div key={index} className="photo-card">
              <img
                src={photo.url}
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
