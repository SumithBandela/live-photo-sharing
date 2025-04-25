import React, { useEffect, useState } from 'react';
import './update-album.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';

export function UpdateAlbum() {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios
      .get(`https://rashmiphotography.com/backend/add-album.php?id=${id}`)
      .then((response) => {
        if (response.data && response.data.album) {
          const album = response.data.album;
          setAlbumData(album);
          setPreview(album.thumbnail); // safely access now
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
      download: albumData?.download || 'no',
      status: albumData?.is_visible || 'private',
    },
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('download', values.download);
      formData.append('status', values.status);
      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail);
      }

      axios
        .post('https://rashmiphotography.com/backend/update-album.php', formData)
        .then((res) => {
          alert('Album updated successfully!');
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
          onChange={formik.handleChange}
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
          src={`https://rashmiphotography.com/backend/${preview}`}
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
              value="yes"
              checked={formik.values.download === 1}
              onChange={formik.handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="download"
              value="no"
              checked={formik.values.download === 0}
              onChange={formik.handleChange}
            />
            No
          </label>
        </div>

        <div className="radio-group">
          <label>Album Status:</label>
          <label>
            <input
              type="radio"
              name="status"
              value="public"
              checked={formik.values.status === 1}
              onChange={formik.handleChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="private"
              checked={formik.values.status === 0}
              onChange={formik.handleChange}
            />
            Private
          </label>
        </div>

        <button type="submit">Update Album</button>
      </form>
    </div>
  );
}
