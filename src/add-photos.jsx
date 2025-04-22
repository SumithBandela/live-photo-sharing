import { useState } from 'react';
import './addphotos.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export function AddPhotos() {
  const [selectedPreview, setSelectedPreview] = useState([]);
  let navigate = useNavigate();
  const [message, setMessage] = useState('');
  const {title} = useParams();
  const [cookies] = useCookies(['adminUser'])
  const formik = useFormik({
    initialValues: {
      images: []
    },
    onSubmit: async (values) => {
      if (!values.images.length) {
        setMessage("Please select images to upload.");
        return;
      }

      const formData = new FormData();
      formData.append("username", cookies.adminUser.toLowerCase());
      formData.append("title", title);

      values.images.forEach((img) => {
        formData.append("images[]", img);
      });

      try {
        const res = await axios.post("https://rashmiphotography.com/backend/add-photos.php", formData);
        if (res.data.status === "success") {
          setMessage("Images uploaded successfully!");
          setSelectedPreview([]); // Clear previews after upload
          navigate(-1)
        } else {
          setMessage(res.data.message || "Failed to upload images.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Something went wrong.");
      }
    },
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    formik.setFieldValue("images", files);
    setSelectedPreview(files.map(file => URL.createObjectURL(file)));
  };

  const imageStyle = {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '10px',
    margin: '8px',
    border: '2px solid white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  };

  return (
    <div className="addphotos-container">
      <h2>Add Photos to Album</h2>
      <form className="photo-form" onSubmit={formik.handleSubmit}>
        <p><strong>Album:</strong> {title}</p>
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          required
        />

        {selectedPreview.length > 0 && (
          <div className="preview-gallery">
            <p className="mt-3"><strong>Selected Images:</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {selectedPreview.map((src, index) => (
                <img key={index} src={src} alt="preview" style={imageStyle} />
              ))}
            </div>
          </div>
        )}

        <button type="submit">Upload Photos</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
