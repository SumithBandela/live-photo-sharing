import React, { useState } from 'react';
import './update-album.css';

export function UpdateAlbum(){
  const [albumData, setAlbumData] = useState({
    title: '',
    description: '',
    thumbnail: null,
    download: 'no',
    status: 'private',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbumData({ ...albumData, [name]: value });
  };

  const handleFileChange = (e) => {
    setAlbumData({ ...albumData, thumbnail: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(albumData); // Handle form submission here
  };

  return (
    <div className="updatealbum-container">
      <h2>Update Album</h2>
      <form className="album-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Album Title"
          value={albumData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Album Description"
          value={albumData.description}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {albumData.thumbnail && (
          <img
            src={URL.createObjectURL(albumData.thumbnail)}
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
              checked={albumData.download === 'yes'}
              onChange={handleChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="download"
              value="no"
              checked={albumData.download === 'no'}
              onChange={handleChange}
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
              checked={albumData.status === 'public'}
              onChange={handleChange}
            />
            Public
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="private"
              checked={albumData.status === 'private'}
              onChange={handleChange}
            />
            Private
          </label>
        </div>

        <button type="submit">Update Album</button>
      </form>
    </div>
  );
};

