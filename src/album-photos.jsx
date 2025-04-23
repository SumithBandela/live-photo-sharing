import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './album-photos.css';
import { useCookies } from 'react-cookie';
export function AlbumPhotos() {
    const { title } = useParams(); // album title
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
  
 

  return (
    <div className="album-photos">
      <h2>Photos in #{title}</h2>
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
