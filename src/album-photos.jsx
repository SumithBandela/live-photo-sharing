import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './album-photos.css';
export function AlbumPhotos() {
    const { slug } = useParams(); // album title
    const [photos, setPhotos] = useState([]);
  const [albumDetails, setAlbumDetails] = useState({
    title: '',
    description: '',
    download: false
  });

  useEffect(() => {
    axios
      .get(`https://rashmiphotography.com/backend/get_album_photos.php`, {
        params: { slug: slug }
      })
      .then((response) => {
        if (response.data.status === 'success') {
          // Set album details
          setAlbumDetails({
            title: response.data.album.title,
            description: response.data.album.description,
            download: response.data.album.download
          });

          // Map photos data
          const fetchedPhotos = response.data.album.images.map((image) => ({
            url: image.img_src,
            visible: image.is_visible
          }));

          setPhotos(fetchedPhotos); // Set photos
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  }, [slug]);
 

  return (
    <div className="album-photos">
      <h2>Photos in #{albumDetails.title}</h2>
      <p>{albumDetails.description}</p>
      <div className="photos-grid">
        {photos.map((photo, i) => (
          <img
            key={i}
            src={`https://rashmiphotography.com/backend/${photo.url}`}
            alt={`img ${i + 1}`}
            className="photo-img"
          />
        ))}
      </div>
    </div>
  );
}
