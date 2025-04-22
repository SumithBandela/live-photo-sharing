import { useState } from 'react';
import './add-album.css';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export function AddAlbum() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(['adminUser']);
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      thumbnail: null,
      download: false,
      isVisible: true,
      watermark: '',
      username: cookies.adminUser.toLowerCase()
    },
    validationSchema: yup.object({
      title: yup.string().required('Title is required'),
      description: yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('download', values.download ? '1' : '0');
        formData.append('isVisible', values.isVisible ? '1' : '0');
        formData.append('watermark', values.watermark);
        formData.append('username', values.username); // ✅ Send username
  
        if (values.thumbnail) {
          formData.append('thumbnail', values.thumbnail);
        }
  
        const response = await axios.post(
          'https://rashmiphotography.com/backend/add-album.php',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
  
        if (response.data.status === 'success') {
          alert('Album added successfully.');
          resetForm();
          setThumbnailPreview(null);
          navigate('/albums');
        } else {
          alert(response.data.message || 'Failed to add album.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue('thumbnail', file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="addalbum-container">
      <h2>Add New Album</h2>
      <form className="album-form" onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Album Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.title && formik.errors.title && (
          <div className="error">{formik.errors.title}</div>
        )}

        <textarea
          name="description"
          placeholder="Album Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.description && formik.errors.description && (
          <div className="error">{formik.errors.description}</div>
        )}

        <input
          type="text"
          name="watermark"
          placeholder="Watermark"
          value={formik.values.watermark}
          onChange={formik.handleChange}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          required
        />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail Preview"
            style={{ width: '100px', marginTop: '10px' }}
          />
        )}

        <div className="radio-group">
          <label>Allow Download:</label>
          <label>
            <input
              type="radio"
              name="download"
              value={true}
              checked={formik.values.download === true}
              onChange={() => formik.setFieldValue('download', true)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="download"
              value={false}
              checked={formik.values.download === false}
              onChange={() => formik.setFieldValue('download', false)}
            />
            No
          </label>
        </div>

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Add Album'}
        </button>
      </form>
    </div>
  );
}
