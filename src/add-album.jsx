import { useState, useEffect } from 'react';
import './add-album.css';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import axios from 'axios';
import { getUserInfo } from './utils/auth';

export function AddAlbum() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserInfo();
    if (user && user.email) {
      setEmail(user.email); // ✅ Use email instead of username
    } else {
      alert('Please login first');
      navigate('/login');
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      thumbnail: null,
      download: false,
      isVisible: true,
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      title: yup.string().required('Title is required'),
      description: yup.string().required('Description is required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('download', values.download ? '1' : '0');
        formData.append('isVisible', values.isVisible ? '1' : '0');
        formData.append('email', email); // ✅ Send email

        if (values.thumbnail) {
          formData.append('thumbnail', values.thumbnail);
        }

        const response = await axios.post(
          'http://localhost:8080/api/albums/add',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
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
