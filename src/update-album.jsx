import React, { useEffect, useState } from 'react';
import './update-album.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { useCookies } from 'react-cookie';
export function UpdateAlbum() {
  const { id } = useParams();
  const [cookies] = useCookies(['adminUser']);
  const [albumData, setAlbumData] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://rashmiphotography.com/backend/add-album.php?id=${id}`)
      .then((response) => {
        if (response.data && response.data.album) {
          const album = response.data.album;
          setAlbumData(album);
          setPreview(`https://rashmiphotography.com/backend/${album.thumbnail}`);
        } else {
          console.warn('No album data found:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching album:', error);
      });
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: albumData?.title || '',
      description: albumData?.description || '',
      thumbnail: null,
      download: albumData ? Number(albumData.download) : 0,
      isVisible: albumData ? Number(albumData.is_visible) : 0,
    },
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('username', cookies.adminUser.toLowerCase());
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('download', values.download);
      formData.append('isVisible', values.isVisible);

      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail);
      }

      axios
        .post('https://rashmiphotography.com/backend/edit-album.php', formData)
        .then((res) => {
          const data = res.data;
          if (data.status === 'success') {
            alert('Album updated successfully!');
            navigate('/albums');
          } else {
            alert(data.message || 'Failed to update album.');
          }
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to update album.');
        });
    },
  });

  const handleThumbnailChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue('thumbnail', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="updatealbum-container">
      <h2>Update Album</h2>
      <form className="album-form" onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Album Title"
          value={formik.values.title}
          readOnly
        />

        <textarea
          name="description"
          placeholder="Album Description"
          value={formik.values.description}
          onChange={formik.handleChange}
        />

        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleThumbnailChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Thumbnail Preview"
            className="thumbnail-preview"
          />
        )}

        <div className="radio-group">
          <label>Allow Download:</label>
          <label>
            <input
              type="radio"
              name="download"
              value={1}
              checked={formik.values.download === 1}
              onChange={() => formik.setFieldValue('download', 1)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="download"
              value={0}
              checked={formik.values.download === 0}
              onChange={() => formik.setFieldValue('download', 0)}
            />
            No
          </label>
        </div>

        <div className="radio-group">
          <label>Album Status:</label>
          <label>
            <input
              type="radio"
              name="isVisible"
              value={1}
              checked={formik.values.isVisible === 1}
              onChange={() => formik.setFieldValue('isVisible', 1)}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              name="isVisible"
              value={0}
              checked={formik.values.isVisible === 0}
              onChange={() => formik.setFieldValue('isVisible', 0)}
            />
            Private
          </label>
        </div>

        <button type="submit">Update Album</button>
      </form>
    </div>
  );
}
