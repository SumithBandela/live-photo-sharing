import { useState } from 'react';
import './addphotos.css';
import { useParams } from 'react-router-dom';

export function AddPhotos() {
  const [photos, setPhotos] = useState([]);
  let{albumId} = useParams();
  const handlePhotoUpload = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle photo upload logic here (e.g., to selected album ID)
    console.log('Uploading to Album ID:', albumId, 'Photos:', photos);
  };

  return (
    <div className="addphotos-container">
      <h2>Add Photos to Album</h2>
      <form className="photo-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Album ID or Name" value={albumId}/>
        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} required />
        <button type="submit">Upload Photos</button>
      </form>
    </div>
  );
}
